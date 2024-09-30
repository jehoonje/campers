import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 9999,
  },
  icon: {
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
