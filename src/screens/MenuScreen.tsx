import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';

interface MenuItem {
  id: string;
  name: string;
  category: 'Food' | 'Beer' | 'Spirits' | 'Cocktails';
  price: number;
}

const MENU_ITEMS: MenuItem[] = [
  // Food Items
  { id: '1', name: 'Wings', category: 'Food', price: 10.99 },
  { id: '2', name: 'Fingers', category: 'Food', price: 8.99 },
  { id: '3', name: 'Peppers', category: 'Food', price: 7.99 },
  // Beer Items
  { id: '4', name: 'Guinness', category: 'Beer', price: 6.99 },
  { id: '5', name: 'Heineken', category: 'Beer', price: 5.99 },
  { id: '6', name: 'Landshark', category: 'Beer', price: 5.99 },
  { id: '7', name: 'Lighthouse', category: 'Beer', price: 5.99 },
  { id: '8', name: 'Beer', category: 'Beer', price: 5.99 },
  { id: '9', name: 'Stout', category: 'Beer', price: 6.99 },
  // Spirits
  { id: '10', name: 'Smirnoff', category: 'Spirits', price: 4.99 },
  { id: '11', name: 'Vodka', category: 'Spirits', price: 4.99 },
  // Cocktails
  { id: '12', name: 'Shot', category: 'Cocktails', price: 3.99 },
  { id: '13', name: 'Margarita', category: 'Cocktails', price: 8.99 },
  { id: '14', name: 'Rum & Coke', category: 'Cocktails', price: 7.99 },
];

const MenuScreen: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(MENU_ITEMS.map((item) => item.category)));

  const filteredItems =
    activeCategory === null
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const handleItemPress = (item: MenuItem) => {
    setSelectedItems([...selectedItems, item]);
  };

  const numColumns = 3;
  const itemWidth = Dimensions.get('window').width / numColumns - 12;

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={[styles.menuItem, { width: itemWidth }]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Restaurant POS Menu</Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            activeCategory === null && styles.categoryButtonActive,
          ]}
          onPress={() => setActiveCategory(null)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              activeCategory === null && styles.categoryButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                activeCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Grid */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
        scrollEnabled={true}
      />

      {/* Order Summary Footer */}
      {selectedItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.orderSummary}>
            <Text style={styles.orderCount}>Items: {selectedItems.length}</Text>
            <Text style={styles.orderTotal}>
              Total: $
              {selectedItems
                .reduce((sum, item) => sum + item.price, 0)
                .toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryButton: {
    marginHorizontal: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#2c3e50',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  gridContainer: {
    padding: 8,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderCount: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  checkoutButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MenuScreen;
