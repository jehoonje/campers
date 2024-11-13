// src/components/Shared/styles.js
import { StyleSheet } from 'react-native';

const sharedStyles = StyleSheet.create({
  facilityItem: {
    alignItems: 'center',
    margin: 10,
  },
  facilityText: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageRatingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTabButton: {
    borderColor: '#333',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: '#333',
  },
  inactiveTabButtonText: {
    color: '#aaa',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  facilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop:5,
  },
});

export default sharedStyles;
