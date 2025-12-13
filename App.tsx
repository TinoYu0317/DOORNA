import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppState, ViewMode, KeyAuth, FrameType, DoornaItem } from './types';
import { Lobby } from './components/Lobby';
import { Home } from './components/Home';
import { ExpandedFrame } from './components/ExpandedFrame';
import { AIEdit } from './components/AIEdit';
import { useDoornaGestures } from './hooks/useDoornaGestures';

const App: React.FC = () => {
  // --- State ---
  const [currentState, setCurrentState] = useState<AppState>(AppState.S0_LOBBY_DOOR);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PAGED);
  const [keyAuth, setKeyAuth] = useState<KeyAuth>(KeyAuth.LOCKED);
  const [pageIndex, setPageIndex] = useState(0);
  const [activeFrame, setActiveFrame] = useState<FrameType | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize with Mock Data for Demo
  const [items, setItems] = useState<DoornaItem[]>([
    {
        id: 'demo-today-1',
        createdAt: Date.now(),
        source: 'system',
        rawText: 'Morning Yoga',
        type: FrameType.TODAY,
        title: 'Morning Yoga',
        payload: { time: '07:00' },
        status: 'done'
    },
    {
        id: 'demo-today-2',
        createdAt: Date.now(),
        source: 'system',
        rawText: 'Team Standup',
        type: FrameType.TODAY,
        title: 'Team Standup',
        payload: { time: '09:30' },
        status: 'active'
    },
    {
        id: 'demo-today-3',
        createdAt: Date.now(),
        source: 'system',
        rawText: 'Call Mom',
        type: FrameType.TODAY,
        title: 'Call Mom',
        payload: { time: '18:00' },
        status: 'active'
    },
    {
      id: 'demo-cal-1',
      createdAt: Date.now(),
      source: 'system',
      rawText: 'Design Review',
      type: FrameType.CALENDAR,
      title: 'Design Review',
      payload: { date: '10:00', location: 'Meeting Room A', day: 25 },
      status: 'active'
    },
    {
      id: 'demo-cal-2',
      createdAt: Date.now(),
      source: 'system',
      rawText: 'Lunch with Sarah',
      type: FrameType.CALENDAR,
      title: 'Lunch with Sarah',
      payload: { date: '13:00', location: 'Sweetgreen', day: 25 },
      status: 'active'
    },
    {
      id: 'demo-fin-1',
      createdAt: Date.now() - 3600000,
      source: 'system',
      rawText: 'Whole Foods',
      type: FrameType.FINANCE,
      title: 'Whole Foods Market',
      payload: { amount: -84.20, date: 'Today' },
      status: 'active'
    },
    {
      id: 'demo-key-1',
      createdAt: Date.now(),
      source: 'system',
      rawText: 'Netflix',
      type: FrameType.KEY,
      title: 'Netflix',
      payload: { username: 'user@email.com' },
      status: 'active'
    },
    {
      id: 'demo-key-2',
      createdAt: Date.now(),
      source: 'system',
      rawText: 'Chase Bank',
      type: FrameType.KEY,
      title: 'Chase Bank',
      payload: { username: 'checking_main' },
      status: 'active'
    },
    {
      id: 'demo-key-3',
      createdAt: Date.now(),
      source: 'system',
      rawText: 'SSN',
      type: FrameType.KEY,
      title: 'Social Security',
      payload: { note: 'Safe box 3' },
      status: 'active'
    }
  ]);
  
  // Gesture Physics State
  const [dragX, setDragX] = useState(0);
  const [doorPosition, setDoorPosition] = useState({ x: 0, y: 0 });

  // Update Body Background for Dark Mode
  useEffect(() => {
    // Light Mode: Rich Cream (#FFF9EF)
    // Dark Mode: Zinc-900 (#18181b)
    document.body.style.backgroundColor = theme === 'dark' ? '#18181b' : '#FFF9EF';
  }, [theme]);

  // --- Actions ---
  const saveItem = (item: DoornaItem) => {
    setItems(prev => [...prev, item]);
  };

  const handleOpenDoor = () => {
    setPageIndex(0); 
    setDragX(0); 
    setDoorPosition({ x: -window.innerWidth, y: 0 }); // Slide Left
    setCurrentState(viewMode === ViewMode.SINGLE ? AppState.S2_HOME_SINGLEPAGE : AppState.S1_HOME_PAGED);
  };

  const handleReturnToLobby = (method: 'slide' | 'drop' = 'slide') => {
    setActiveFrame(null);
    setPageIndex(0); 
    setDragX(0);
    
    if (method === 'drop') {
      // 1. Instantaneously move door to top
      setDoorPosition({ x: 0, y: -window.innerHeight });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setDoorPosition({ x: 0, y: 0 });
        });
      });
    } else {
      setDoorPosition({ x: 0, y: 0 }); 
    }
    
    setCurrentState(AppState.S0_LOBBY_DOOR);
  };

  const toggleViewMode = () => {
    setViewMode(prev => {
      const next = prev === ViewMode.PAGED ? ViewMode.SINGLE : ViewMode.PAGED;
      if (currentState === AppState.S1_HOME_PAGED || currentState === AppState.S2_HOME_SINGLEPAGE) {
         setCurrentState(next === ViewMode.SINGLE ? AppState.S2_HOME_SINGLEPAGE : AppState.S1_HOME_PAGED);
      }
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Gestures ---
  useDoornaGestures({
    onTwoFingerPullDown: () => {
      handleReturnToLobby('drop');
    },
    onThreeFingerTap: () => {
      toggleViewMode();
    },
    onPan: (dx, dy) => {
      if (currentState === AppState.S0_LOBBY_DOOR) {
        setDoorPosition({ x: Math.min(0, dx), y: 0 }); 
      } else if (currentState === AppState.S1_HOME_PAGED) {
        setDragX(dx);
      }
    },
    onPanEnd: (dx, velocity) => {
      const screenW = window.innerWidth;
      const threshold = screenW * 0.2; 

      if (currentState === AppState.S0_LOBBY_DOOR) {
        // Smoother slide release
        if (dx < -threshold || velocity < -300) {
          handleOpenDoor();
        } else {
          setDoorPosition({ x: 0, y: 0 }); 
        }
      } else if (currentState === AppState.S1_HOME_PAGED) {
        let change = 0;
        if (dx < -threshold || velocity < -500) {
           change = 1; 
        } else if (dx > threshold || velocity > 500) {
           change = -1; 
        }

        if (change === 1) {
            if (pageIndex < 2) setPageIndex(pageIndex + 1);
        } else if (change === -1) {
            if (pageIndex > 0) {
                setPageIndex(pageIndex - 1);
            } else {
                handleReturnToLobby('slide');
                return;
            }
        }
        setDragX(0); 
      }
    }
  });

  // --- Frame Interactions ---
  const handleFrameTap = (type: FrameType) => {
    if (type === FrameType.CALENDAR || type === FrameType.TODAY) {
       return; 
    }

    if (type === FrameType.KEY && keyAuth === KeyAuth.LOCKED) {
      const pin = prompt("Doorna Secure Enclave \nEnter Passcode (Hint: 0000)");
      if (pin === "0000") {
          setKeyAuth(KeyAuth.UNLOCKED);
          setActiveFrame(type);
          // FIX: Directly open the frame instead of setting an intermediate 'UNLOCKED' state that isn't handled by the renderer
          setCurrentState(AppState.S3_FRAME_EXPANDED);
      } else {
          alert("Access Denied");
          return;
      }
    } else {
        // Already unlocked or not a key frame
        setActiveFrame(type);
        setCurrentState(AppState.S3_FRAME_EXPANDED);
    }
  };

  const handleFrameLongPress = (type: FrameType) => {
    setActiveFrame(type);
    setCurrentState(AppState.S4_AI_EDIT);
  };

  const finalDoorX = currentState === AppState.S0_LOBBY_DOOR ? doorPosition.x : -window.innerWidth;
  const finalDoorY = currentState === AppState.S0_LOBBY_DOOR ? doorPosition.y : 0;

  return (
    // Changed: Added max-w-[430px] (iPhone Max width) and mx-auto for desktop centering. 
    // Changed: h-screen to h-[100dvh] for better mobile browser support.
    <div className={`relative w-full max-w-[430px] mx-auto h-[100dvh] overflow-hidden select-none bg-transparent transition-colors duration-500 shadow-2xl`}>
      
      {/* 
         DESK LAYER (Bottom) 
         The Logo lives here, "on the desk".
         UPDATED: 'text-stone-400' for light mode for a warm earthy feel.
      */}
      <div 
        className={`
          absolute top-12 left-8 z-0 
          text-xl font-black tracking-[0.3em] uppercase 
          pointer-events-none transition-all duration-500
          ${theme === 'dark' ? 'text-white/20' : 'text-stone-400/30'}
        `}
      >
        Doorna
      </div>

      {/* Home Pages */}
      <Home 
        viewMode={viewMode}
        pageIndex={pageIndex}
        items={items}
        onFrameTap={handleFrameTap}
        onFrameLongPress={handleFrameLongPress}
        onPageChange={setPageIndex}
        dragX={currentState === AppState.S1_HOME_PAGED ? dragX : 0} 
        theme={theme}
      />

      {/* Lobby Layer (The Door) */}
      <div 
        className="absolute inset-0 z-20 will-change-transform"
        style={{ 
          transform: `translate3d(${finalDoorX}px, ${finalDoorY}px, 0)`,
          // Using a slightly longer duration and quintic bezier for that "sliding" feeling
          transition: (currentState === AppState.S0_LOBBY_DOOR && doorPosition.x === 0 && doorPosition.y === 0) 
            ? 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)' 
            : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' 
        }}
      >
        <Lobby 
          onOpenDoor={handleOpenDoor} 
          onSaveItem={saveItem}
          isVisible={currentState === AppState.S0_LOBBY_DOOR}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {currentState === AppState.S3_FRAME_EXPANDED && activeFrame && (
          <ExpandedFrame 
            type={activeFrame} 
            items={items} 
            onClose={() => {
                setActiveFrame(null);
                setCurrentState(viewMode === ViewMode.SINGLE ? AppState.S2_HOME_SINGLEPAGE : AppState.S1_HOME_PAGED);
            }} 
            theme={theme}
          />
        )}
        
        {currentState === AppState.S4_AI_EDIT && activeFrame && (
          <AIEdit 
             type={activeFrame}
             onClose={() => {
                setActiveFrame(null);
                setCurrentState(viewMode === ViewMode.SINGLE ? AppState.S2_HOME_SINGLEPAGE : AppState.S1_HOME_PAGED);
             }}
             theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;