import React, { createContext, useCallback, useContext, useRef } from 'react';
import { AccessibilityInfo, findNodeHandle, View } from 'react-native';

const AnnounceContext = createContext<{ announce: (message: string) => void }>({ announce: () => undefined });

export const useAnnouncer = () => useContext(AnnounceContext);

export const AccessibilityAnnouncer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const viewRef = useRef<View>(null);
  const announce = useCallback((message: string) => {
    if (!message) return;
    const reactTag = findNodeHandle(viewRef.current);
    if (reactTag) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, []);

  return (
    <AnnounceContext.Provider value={{ announce }}>
      <View ref={viewRef} accessible accessibilityLabel="MindMosaic app">
        {children}
      </View>
    </AnnounceContext.Provider>
  );
};
