import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    padding: 20,
    marginTop: 50,
    backgroundColor: 'black',
    flex: 1,
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    padding: 8,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    color: 'white',
    backgroundColor: '#333',
    borderColor: '#555',
  },
  button: {
    backgroundColor: '#800020',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default styles;
