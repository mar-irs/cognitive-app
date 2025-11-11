import React from 'react';
import { View, useWindowDimensions } from 'react-native';

interface ResponsiveGridProps {
  minItemWidth?: number;
  gap?: number;
  children: React.ReactNode[] | React.ReactNode;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ minItemWidth = 200, gap = 16, children }) => {
  const { width } = useWindowDimensions();
  const items = React.Children.toArray(children);
  const columns = Math.max(1, Math.floor(width / (minItemWidth + gap)));

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -gap / 2 }}>
      {items.map((child, index) => (
        <View key={index} style={{ width: `${100 / columns}%`, padding: gap / 2 }}>
          {child}
        </View>
      ))}
    </View>
  );
};
