import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from '@/constants/Colors';
import Checkbox from './Checkbox';

interface TreeItem {
  title: string;
  key: string;
  children?: TreeItem[];
  isLeaf: boolean;
}

interface TreeSelectorProps {
  treeData: TreeItem[];
  onSelect: (key: string) => void;
}

interface RenderItemProps {
  item: TreeItem;
  level?: number;
}

const TreeSelector: React.FC<TreeSelectorProps> = ({ treeData, onSelect }) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleSelect = (key: string, isLeaf: boolean) => {
    if (isLeaf) {
      setSelectedKeys((prev) => {
        const newSelection = prev.includes(key)
          ? prev.filter((k) => k !== key)
          : [...prev, key];
        onSelect(key);
        return newSelection;
      });
    } else {
      toggleExpand(key);
    }
  };

  const renderItem = ({ item, level = 0 }: RenderItemProps) => {
    const isExpanded = expandedKeys.includes(item.key);
    const isSelected = selectedKeys.includes(item.key);

    return (
      <View>
        <View style={[styles.item, { paddingLeft: 16 * level }]}>
          {!item.isLeaf && (
            <TouchableOpacity onPress={() => toggleExpand(item.key)} style={styles.expandButton}>
              <MaterialCommunityIcons
                name={isExpanded ? 'chevron-down' : 'chevron-right'}
                size={24}
                color={Colors.primary.green}
              />
            </TouchableOpacity>
          )}
          <Checkbox
            checked={isSelected}
            onChange={() => toggleSelect(item.key, item.isLeaf)}
            title={item.title}
          />
        </View>
        {isExpanded &&
          item.children &&
          item.children.map((child) => renderItem({ item: child, level: level + 1 }))}
      </View>
    );
  };

  return (
    <FlatList
      data={treeData}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  expandButton: {
    padding: 5,
    marginRight: 5,
  },
});

export default TreeSelector;