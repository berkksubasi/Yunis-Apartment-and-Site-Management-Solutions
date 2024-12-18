import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Task {
  id: string;
  title: string;
  location: string;
  assignedTo: string | null;
  status: 'İnceleniyor' | 'Bekleyen' | 'Tamamlanmış';
  date: string;
  icon: string;
}

const TaskTrackingScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Havuz Bakımı',
      location: '651 ada B-04',
      assignedTo: null,
      status: 'İnceleniyor',
      date: '24 Ağu 2022',
      icon: 'https://via.placeholder.com/50',  
    },
    {
      id: '2',
      title: 'Asansör Bakımı',
      location: '651 ada B-04',
      assignedTo: null,
      status: 'Bekleyen',
      date: '22 Ağu 2022',
      icon: 'https://via.placeholder.com/50', 
    },
  ]);

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskCard} activeOpacity={0.7}>
      <View style={styles.taskHeader}>
        <Image source={{ uri: item.icon }} style={styles.icon} />
        <View>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDetails}>{item.location}</Text>
        </View>
      </View>
      <View style={styles.taskFooter}>
        <Text style={[styles.taskStatus, getStatusStyle(item.status)]}>{item.status}</Text>
        <Text style={styles.taskDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'İnceleniyor':
        return { color: 'orange' };
      case 'Bekleyen':
        return { color: 'red' };
      case 'Tamamlanmış':
        return { color: 'green' };
      default:
        return { color: 'gray' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Görev Takibi</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  listContainer: {
    padding: 15,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 3, // Android'de gölge efekti
    shadowColor: '#000', // iOS'da gölge efekti
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDetails: {
    fontSize: 14,
    color: 'gray',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskDate: {
    fontSize: 12,
    color: 'gray',
  },
});

export default TaskTrackingScreen;
