import { exportFullBackup, importFullBackup } from '@/storage/storage'
import { FullBackup } from '@/types'
import { useRef } from 'react'
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// ─── Web export ────────────────────────────────────────────────────────────────
const downloadJsonWeb = (data: object, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Native helpers ────────────────────────────────────────────────────────────
const downloadJsonNative = async (data: object, filename: string) => {
  const { writeAsStringAsync, cacheDirectory } = await import('expo-file-system/legacy')
  const { shareAsync } = await import('expo-sharing')
  if (!cacheDirectory) throw new Error('No access to file system')
  const path = cacheDirectory + filename
  await writeAsStringAsync(path, JSON.stringify(data, null, 2))
  await shareAsync(path, { mimeType: 'application/json' })
}

const pickJsonFileNative = async (): Promise<FullBackup | null> => {
  const { getDocumentAsync } = await import('expo-document-picker')
  const { readAsStringAsync } = await import('expo-file-system/legacy')
  const result = await getDocumentAsync({ type: 'application/json' })
  if (result.canceled) return null
  const text = await readAsStringAsync(result.assets[0].uri)
  try {
    return JSON.parse(text) as FullBackup
  } catch {
    return null
  }
}

// ─── Unified export ────────────────────────────────────────────────────────────
const handleExport = async () => {
  const backup = await exportFullBackup()
  const filename = `myjournal-backup-${new Date().toISOString().split('T')[0]}.json`
  if (Platform.OS === 'web') {
    downloadJsonWeb(backup, filename)
  } else {
    await downloadJsonNative(backup, filename)
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean
  onClose: () => void
}

export const SettingsModal = ({ visible, onClose }: Props) => {
  // ─── Safari fix ─────────────────────────────────────────────────────────────
  // Safari on iOS blocks programmatic .click() on dynamically created inputs.
  // The only reliable fix is to have a real <input> element in the DOM at all
  // times, and let the user's tap on our button trigger it directly.
  // useRef gives us a reference to that real DOM element.
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── Export ─────────────────────────────────────────────────────────────────
  const onExport = async () => {
    try {
      await handleExport()
      Alert.alert('✅ Backup saved', 'Your journal data has been exported successfully.')
    } catch (e) {
      Alert.alert('Error', String(e))
    }
  }

  // ─── Import — web ──────────────────────────────────────────────────────────
  // On web: we just click the hidden real <input> element.
  // The actual file reading happens in handleFileChange below.
  const onImportWeb = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const backup = JSON.parse(text) as FullBackup
      await importFullBackup(backup)
      Alert.alert('✅ Restored', 'Your journal data has been restored.')
    } catch {
      Alert.alert('Error', 'Could not read the backup file. Make sure it is a valid MyJournal backup.')
    }
    // Reset input so the same file can be picked again next time
    e.target.value = ''
  }

  // ─── Import — native ───────────────────────────────────────────────────────
  const onImportNative = () => {
    Alert.alert(
      'Restore backup?',
      'This will overwrite your current data. Make sure you export first!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            try {
              const backup = await pickJsonFileNative()
              if (!backup) return
              await importFullBackup(backup)
              Alert.alert('✅ Restored', 'Your journal data has been restored.')
            } catch (e) {
              Alert.alert('Error', String(e))
            }
          },
        },
      ]
    )
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* ─── Hidden file input — always in DOM on web ─── */}
          {Platform.OS === 'web' && (
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Settings</Text>

            {/* ─── Backup ─── */}
            <Text style={styles.sectionLabel}>DATA</Text>

            <TouchableOpacity style={styles.row} onPress={onExport}>
              <View style={styles.rowIcon}><Text style={styles.rowIconText}>⬆️</Text></View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Export backup</Text>
                <Text style={styles.rowSub}>Save all your journal data as a JSON file</Text>
              </View>
              <Text style={styles.rowArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={Platform.OS === 'web' ? onImportWeb : onImportNative}
            >
              <View style={styles.rowIcon}><Text style={styles.rowIconText}>⬇️</Text></View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Restore backup</Text>
                <Text style={styles.rowSub}>Import a previously exported JSON file</Text>
              </View>
              <Text style={styles.rowArrow}>›</Text>
            </TouchableOpacity>

            {/* ─── About ─── */}
            <Text style={styles.sectionLabel}>ABOUT</Text>

            <View style={styles.row}>
              <View style={styles.rowIcon}><Text style={styles.rowIconText}>📔</Text></View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>MyJournal</Text>
                <Text style={styles.rowSub}>Version 1.0.0</Text>
              </View>
            </View>

            <Text style={styles.tip}>
              💡 Tip: Export to iCloud Drive weekly. On PWA, Safari may clear data if your device is low on storage.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconText: { fontSize: 16 },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
  rowSub: { fontSize: 12, color: '#999', marginTop: 1 },
  rowArrow: { fontSize: 18, color: '#CCC' },
  tip: {
    marginTop: 24,
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 8,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
})