import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppState, ViewMode, KeyAuth, FrameType, DoornaItem } from './types';
import { Lobby } from './components/Lobby';
import { Home } from './components/Home';
import { ExpandedFrame } from './components/ExpandedFrame';
import { AIEdit } from './components/AIEdit';
import { Keypad } from './components/Keypad';
import { useDoornaGestures } from './hooks/useDoornaGestures';

const App: React.FC = () => {
  // --- State ---
  const [currentState, setCurrentState] = useState<AppState>(AppState.S0_LOBBY_DOOR);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PAGED);
  const [keyAuth, setKeyAuth] = useState<KeyAuth>(KeyAuth.LOCKED);
  const [pageIndex, setPageIndex] = useState(0);
  const [activeFrame, setActiveFrame] = useState<FrameType | null>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null); // New: Track active folder
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Edit State
  const [editingItem, setEditingItem] = useState<DoornaItem | null>(null);
  
  // Security State
  const [showKeypad, setShowKeypad] = useState(false);
  const [pendingUnlockType, setPendingUnlockType] = useState<FrameType | null>(null);

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
      id: 'demo-rem-1',
      createdAt: Date.now(),
      source: 'system',
      rawText: 'Pay Electric Bill',
      type: FrameType.REMINDER,
      title: 'Pay Electric Bill',
      payload: { due: 'Oct 28' },
      status: 'active'
    },
    {
      id: 'demo-rem-2',
      createdAt: Date.now(),
      source: 'system',
      rawText: 'Water Plants',
      type: FrameType.REMINDER,
      title: 'Water Plants',
      payload: { due: 'Tomorrow' },
      status: 'active'
    },
    {
      id: 'demo-fin-1',
      createdAt: Date.now() - 3600000,
      source: 'system',
      rawText: 'Whole Foods',
      type: FrameType.FINANCE,
      title: 'Whole Foods Market',
      payload: { amount: -84.20, date: 'Today', icon: 'groceries' },
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
    // --- NOTES (GALLERY DATA) ---
    // Genre: Food
    {
      id: 'note-food-1',
      createdAt: Date.now() - 10000000,
      source: 'system',
      rawText: 'Pasta Recipe',
      type: FrameType.NOTE,
      title: 'Carbonara',
      payload: { content: 'Authentic Roman style. Eggs, Pecorino Romano, Guanciale, Black Pepper. No cream!' },
      status: 'active',
      genre: 'Food'
    },
    {
      id: 'note-food-img',
      createdAt: Date.now() - 8000000,
      source: 'system',
      rawText: 'Brunch Spot',
      type: FrameType.NOTE,
      title: 'Sunday Brunch',
      payload: { image: 'https://images.unsplash.com/photo-1626202157771-487bc2a80e03?q=80&w=600&auto=format&fit=crop' },
      status: 'active',
      genre: 'Food'
    },
    // Genre: Sport
    {
      id: 'note-sport-1',
      createdAt: Date.now() - 5000000,
      source: 'system',
      rawText: 'Workout Plan',
      type: FrameType.NOTE,
      title: 'Leg Day Routine',
      payload: { content: '1. Squats 4x10\n2. Lunges 3x12\n3. Leg Press 3x10\n4. Calf Raises 4x15' },
      status: 'active',
      genre: 'Sport'
    },
    // Genre: Ideas
    {
        id: 'note-idea-img',
        createdAt: Date.now() - 2000000,
        source: 'system',
        rawText: 'Inspo',
        type: FrameType.NOTE,
        title: 'Minimalist Interior',
        payload: { image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop' },
        status: 'active',
        genre: 'Design'
    },
    {
      id: 'note-idea-1',
      createdAt: Date.now() - 1000000,
      source: 'system',
      rawText: 'App Idea',
      type: FrameType.NOTE,
      title: 'Doorna V2 Features',
      payload: { content: 'Implement AR view for "Key" frame to find physical keys. Add haptic feedback sequencer.' },
      status: 'active',
      genre: 'Work'
    },
    // Genre: Unsorted
    {
        id: 'note-random',
        createdAt: Date.now(),
        source: 'system',
        rawText: 'WiFi Pass',
        type: FrameType.NOTE,
        title: 'Coffee Shop WiFi',
        payload: { content: 'Pass: espresso123\nNetwork: BeanNet_5G' },
        status: 'active',
        genre: 'General'
    },
    {
        id: 'note-img-2',
        createdAt: Date.now() + 1000,
        source: 'system',
        rawText: 'Architecture',
        type: FrameType.NOTE,
        title: 'Facade Ref',
        payload: { image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=600&auto=format&fit=crop' },
        status: 'active',
        genre: 'Design'
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

  // --- Frame Interactions ---
  const closeExpanded = () => {
      setActiveFrame(null);
      setActiveGenre(null);
      setCurrentState(viewMode === ViewMode.SINGLE ? AppState.S2_HOME_SINGLEPAGE : AppState.S1_HOME_PAGED);
  };

  // --- Gestures ---
  useDoornaGestures({
    onTwoFingerPullDown: () => {
      if (currentState === AppState.S1_HOME_PAGED || currentState === AppState.S2_HOME_SINGLEPAGE) {
        handleReturnToLobby('drop');
      }
    },
    // SQUEEZE: Retreat Layer
    onPinchIn: () => {
        if (currentState === AppState.S3_FRAME_EXPANDED) {
            closeExpanded();
        } else if (currentState === AppState.S1_HOME_PAGED || currentState === AppState.S2_HOME_SINGLEPAGE) {
            handleReturnToLobby('slide');
        }
    },
    // EXPAND: Open Layer
    onPinchOut: () => {
        if (currentState === AppState.S0_LOBBY_DOOR) {
            handleOpenDoor();
        }
    },
    onThreeFingerTap: () => {
      toggleViewMode();
    },
    onPan: (dx, dy) => {
      if (currentState === AppState.S0_LOBBY_DOOR) {
        const dampedDx = dx > 0 ? dx * 0.2 : dx;
        setDoorPosition({ x: dampedDx, y: 0 }); 
      } else if (currentState === AppState.S1_HOME_PAGED) {
        setDragX(dx);
      }
    },
    onPanEnd: (dx, velocity) => {
      const screenW = window.innerWidth;
      const threshold = screenW * 0.25; 

      if (currentState === AppState.S0_LOBBY_DOOR) {
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
            if (pageIndex < 3) setPageIndex(pageIndex + 1);
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
  }, currentState !== AppState.S4_AI_EDIT && !showKeypad); // Active in Expanded now for pinch to close

  const handleFrameTap = (type: FrameType) => {
    if (type === FrameType.KEY && keyAuth === KeyAuth.LOCKED) {
        setPendingUnlockType(type);
        setShowKeypad(true);
    } else {
        setActiveFrame(type);
        setCurrentState(AppState.S3_FRAME_EXPANDED);
    }
  };

  const handleFolderTap = (genre: string) => {
      setActiveFrame(FrameType.NOTE);
      setActiveGenre(genre);
      setCurrentState(AppState.S3_FRAME_EXPANDED);
  };

  const handleUnlock = () => {
      setKeyAuth(KeyAuth.UNLOCKED);
      setShowKeypad(false);
      if (pendingUnlockType) {
          setActiveFrame(pendingUnlockType);
          setCurrentState(AppState.S3_FRAME_EXPANDED);
          setPendingUnlockType(null);
      }
  };

  const handleItemLongPress = (item: DoornaItem) => {
      setEditingItem(item);
      setCurrentState(AppState.S4_AI_EDIT);
  };

  const finalDoorX = currentState === AppState.S0_LOBBY_DOOR ? doorPosition.x : -window.innerWidth;
  const finalDoorY = currentState === AppState.S0_LOBBY_DOOR ? doorPosition.y : 0;

  return (
    <div className={`relative w-full max-w-[430px] mx-auto h-[100dvh] overflow-hidden select-none bg-transparent transition-colors duration-500 shadow-2xl`}>
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

      <Home 
        viewMode={viewMode}
        pageIndex={pageIndex}
        items={items}
        onFrameTap={handleFrameTap}
        onFolderTap={handleFolderTap}
        onItemLongPress={handleItemLongPress}
        onPageChange={setPageIndex}
        dragX={currentState === AppState.S1_HOME_PAGED ? dragX : 0} 
        theme={theme}
      />

      <div 
        className="absolute inset-0 z-20 will-change-transform"
        style={{ 
          transform: `translate3d(${finalDoorX}px, ${finalDoorY}px, 0)`,
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

      <AnimatePresence>
        {currentState === AppState.S3_FRAME_EXPANDED && activeFrame && (
          <ExpandedFrame 
            type={activeFrame} 
            items={items} 
            initialGenre={activeGenre}
            onClose={closeExpanded} 
            onItemLongPress={handleItemLongPress}
            theme={theme}
          />
        )}
        
        {currentState === AppState.S4_AI_EDIT && editingItem && (
          <AIEdit 
             item={editingItem}
             onClose={() => {
                setEditingItem(null);
                if (activeFrame) {
                    setCurrentState(AppState.S3_FRAME_EXPANDED);
                } else {
                    setCurrentState(viewMode === ViewMode.SINGLE ? AppState.S2_HOME_SINGLEPAGE : AppState.S1_HOME_PAGED);
                }
             }}
             theme={theme}
          />
        )}

        {showKeypad && (
            <Keypad 
                onUnlock={handleUnlock}
                onCancel={() => {
                    setShowKeypad(false);
                    setPendingUnlockType(null);
                }}
                theme={theme}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;