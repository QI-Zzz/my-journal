import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Colors } from '../../constants/theme'
import { useNotesScreen } from '../../hooks/useNotesScreen'
import { styles } from '../../styles/notesStyles'

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Notes() {
  const {
    notes, selectedNote,
    createNote, updateNote, deleteNote, openNote, closeNote,
  } = useNotesScreen()

  return (
    <View style={styles.container}>

      {/* ─── Hero ─── */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>MY JOURNAL</Text>
        <Text style={styles.heroTitle}>Notes</Text>
      </View>

      {/* ─── List ─── */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>{notes.length} note{notes.length !== 1 ? 's' : ''}</Text>

        {notes.map(note => (
          <TouchableOpacity key={note.id} onPress={() => openNote(note)} activeOpacity={0.75}>
            <View style={styles.noteCard}>
              <Text style={styles.noteTitle} numberOfLines={1}>
                {note.title || 'Untitled'}
              </Text>
              {note.body ? (
                <Text style={styles.noteBody} numberOfLines={2}>{note.body}</Text>
              ) : null}
              <Text style={styles.noteDate}>{fmtDate(note.updatedAt)}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={createNote} activeOpacity={0.75}>
          <View style={styles.addCard}>
            <Text style={styles.addCardText}>+ New note...</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* ─── Editor modal ─── */}
      <Modal visible={!!selectedNote} animationType="slide" onRequestClose={closeNote}>
        <KeyboardAvoidingView
          style={styles.modal}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeNote}>
              <Text style={styles.modalHeaderBtn}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectedNote && deleteNote(selectedNote.id)}>
              <Text style={styles.modalDelete}>Delete</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.titleInput}
            value={selectedNote?.title ?? ''}
            onChangeText={t => selectedNote && updateNote(selectedNote.id, { title: t })}
            placeholder="Title"
            placeholderTextColor={Colors.textMuted}
            returnKeyType="next"
          />
          <View style={styles.divider} />
          <TextInput
            style={styles.bodyInput}
            value={selectedNote?.body ?? ''}
            onChangeText={t => selectedNote && updateNote(selectedNote.id, { body: t })}
            placeholder="Start writing..."
            placeholderTextColor={Colors.textMuted}
            multiline
            autoFocus={selectedNote?.title === ''}
          />
        </KeyboardAvoidingView>
      </Modal>

    </View>
  )
}
