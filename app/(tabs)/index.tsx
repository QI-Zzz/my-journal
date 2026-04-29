// import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
// import { useJournalData, getTodayDate } from "@/hooks/useJournalData"
// import DateTimePicker from '@react-native-community/datetimepicker'
// import { useState } from "react"
// import { Colors, TabColors, FontSize, Spacing, Radius } from '../../constants/theme'
// import { use } from "react"
// import { TodoItem } from "@/types"

// const formatDate = (dateString: string): string => {
//   const date = new Date(dateString + 'T12:00:00')
//   return date.toLocaleDateString('en-US', {
//     weekday: 'long',
//     month: 'long',
//     day: 'numeric',
//   })
// }

// export default function Today() {
//   const [selectedDate, setSelectedDate] = useState(getTodayDate())
//   const {entry, loading, updateEntry} = useJournalData(selectedDate)
//   const [showDatePicker, setShowDatePicker] = useState(false)
//   const [newTodoText, setNewTodoText] = useState('')

//   const toggleTodo = (id: string) => {
//     const updatedTodos = entry.todos.map(todo => {
//       if (todo.id === id) {
//         return {...todo, done: !todo.done}
//       }
//       return todo
//       })
//     updateEntry({
//       ...entry,
//       todos: updatedTodos
//     })
//   }
//   const addTodo = () => {
//     if (newTodoText.trim() === '') return
//     const newTodo: TodoItem = {
//       id: Date.now().toString(),
//       text: newTodoText,
//       done: false,
//       createdAt: new Date().toISOString(),
//     }
//     updateEntry({
//       ...entry,
//       todos: [...entry.todos, newTodo]
//     })
//   }

//   const deleteTodo = (id: string) => {
//     const updatedTodos = entry.todos.filter(todo => todo.id !== id)
//     updateEntry({
//       ...entry,
//       todos: updatedTodos
//     })
//   }


//   if (loading) {
//     return <Text>Loading...</Text>
//   }
//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <Text onPress={() => setShowDatePicker(true)} style={styles.dateText}>
//           {formatDate(selectedDate)}
//         </Text>
//         {showDatePicker && (
//           <DateTimePicker
//             value={new Date(selectedDate)}
//             mode='date'
//             onChange={(event, date) => {
//               setShowDatePicker(false)
//               if (date) setSelectedDate(date.toISOString().split('T')[0])
//             }}  
//           />
//         )
//         }
//       </View>

//       {/* {TodoSection} */}
//       <View style={styles.section}>
//         <Text style={styles.titles}>TODAY'S TODOS</Text>
//         <View>
//           {entry?.todos.map(todo => (
//             <View key={todo.id}>
//               <TouchableOpacity onPress={() => toggleTodo(todo.id)}>
//                 <View></View>
//               </TouchableOpacity>
//             </View>
//           )

//           )}
//         </View>
//       </View>
//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     padding: Spacing.lg,
//   },
//   header: {
//     paddingBottom: Spacing.md,
//   },
//   dateText: {
//     fontSize: FontSize.title,
//     fontWeight: '500',
//     color: Colors.textSecondary
//   },
//   section: {
//     marginBottom: Spacing.xl,
//   },
//   titles: {
//     fontSize: FontSize.xxl,
//     fontWeight: '500',
//     color: Colors.textSecondary
//   }
// })