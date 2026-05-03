import { LifeArea } from '@/types'
import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  AREA_COLOR,
  AREA_LABEL,
  AREAS,
  useGoalsScreen,
} from '../../hooks/useGoalsScreen'
import { styles } from '../../styles/goalsStyles'
import { Colors } from '../../constants/theme'
import { GoalMeasurable } from '../../types'

// ─── Progress helpers ───────────────────────────────────
const progressValue = (g: GoalMeasurable): number => {
  if (g.current !== undefined && g.target && g.target > 0)
    return Math.min(100, (g.current / g.target) * 100)
  return Math.min(100, g.progress)
}

const progressLabel = (g: GoalMeasurable): string => {
  if (g.current !== undefined && g.target !== undefined)
    return `${g.current} / ${g.target}`
  return `${g.progress}%`
}

// ─── Sheet modal wrapper ────────────────────────────────
function Sheet({
  visible, onClose, title, children,
}: {
  visible: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{title}</Text>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default function Goals() {
  const {
    loading, measurableGoals, checklistGoals, daysLeft, currentYear,
    addMeasurableGoal, updateMeasurableGoal, deleteMeasurableGoal,
    addChecklistGoal, toggleChecklistGoal, deleteChecklistGoal,
    getVision, toggleVisionGoal, addVisionGoal, deleteVisionGoal,
  } = useGoalsScreen()

  // ─── Checklist inline input ─────────────────────────
  const [newCheckText, setNewCheckText] = useState('')

  // ─── Add measurable modal ───────────────────────────
  const [showAddM, setShowAddM] = useState(false)
  const [editingM, setEditingM] = useState<GoalMeasurable | null>(null)
  const [mTitle, setMTitle] = useState('')
  const [mCurrent, setMCurrent] = useState('')
  const [mTarget, setMTarget] = useState('')
  const [mProgress, setMProgress] = useState('')

  const openAddMeasurable = () => {
    setEditingM(null)
    setMTitle(''); setMCurrent(''); setMTarget(''); setMProgress('')
    setShowAddM(true)
  }

  const openEditMeasurable = (g: GoalMeasurable) => {
    setEditingM(g)
    setMTitle(g.title)
    setMCurrent(g.current?.toString() ?? '')
    setMTarget(g.target?.toString() ?? '')
    setMProgress(g.progress.toString())
    setShowAddM(true)
  }

  const saveMeasurable = () => {
    if (!mTitle.trim()) return
    const current = mCurrent ? parseFloat(mCurrent) : undefined
    const target  = mTarget  ? parseFloat(mTarget)  : undefined
    const progress = mProgress ? parseFloat(mProgress) : (
      current !== undefined && target ? Math.round((current / target) * 100) : 0
    )
    if (editingM) {
      updateMeasurableGoal(editingM.id, { title: mTitle.trim(), current, target, progress })
    } else {
      addMeasurableGoal({ title: mTitle.trim(), current, target, progress })
    }
    setShowAddM(false)
  }

  // ─── Add vision modal ───────────────────────────────
  const [showAddV, setShowAddV] = useState(false)
  const [vArea, setVArea] = useState<LifeArea>('career')
  const [vTitle, setVTitle] = useState('')
  const [vYear, setVYear] = useState('')

  const openAddVision = () => {
    setVArea('career'); setVTitle(''); setVYear('')
    setShowAddV(true)
  }

  const saveVision = () => {
    if (!vTitle.trim()) return
    const year = vYear ? parseInt(vYear) : undefined
    addVisionGoal(vArea, vTitle.trim(), year)
    setShowAddV(false)
  }

  if (loading) return <Text>Loading...</Text>

  return (
    <View style={styles.container}>

      {/* ─── Hero ─── */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>MY JOURNAL</Text>
        <Text style={styles.heroTitle}>Goals {currentYear}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* ─── Days left ─── */}
        <View style={styles.daysCard}>
          <Text style={styles.daysNumber}>{daysLeft}</Text>
          <Text style={styles.daysLabel}>days left in {currentYear}</Text>
        </View>

        {/* ─── 2026 Goals ─── */}
        <View>
          <Text style={styles.sectionLabel}>{currentYear} Goals</Text>
          <View style={styles.goalCardGap}>
            {measurableGoals.map(goal => (
              <TouchableOpacity
                key={goal.id}
                onPress={() => openEditMeasurable(goal)}
                onLongPress={() =>
                  Alert.alert('Delete goal?', goal.title, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteMeasurableGoal(goal.id) },
                  ])
                }
                activeOpacity={0.8}
              >
                <View style={styles.goalCard}>
                  <View style={styles.goalRow}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalProgress}>{progressLabel(goal)}</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[
                      styles.fill,
                      { width: `${progressValue(goal)}%`, backgroundColor: Colors.accent },
                    ]} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={openAddMeasurable}>
              <Text style={styles.addBtnText}>+ Add measurable goal...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── 2026 Checklist ─── */}
        <View>
          <Text style={styles.sectionLabel}>{currentYear} Checklist</Text>
          <View style={styles.checklistCard}>
            {checklistGoals.map((goal, i) => (
              <View
                key={goal.id}
                style={[styles.checkRow, i === checklistGoals.length - 1 && !true && styles.checkRowLast]}
              >
                <TouchableOpacity onPress={() => toggleChecklistGoal(goal.id)}>
                  <View style={[styles.circleBox, goal.done && styles.circleBoxDone]}>
                    {goal.done && <Text style={styles.checkTick}>✓</Text>}
                  </View>
                </TouchableOpacity>
                <Text style={[styles.checkText, goal.done && styles.checkTextDone]}>
                  {goal.title}
                </Text>
                <TouchableOpacity onPress={() => deleteChecklistGoal(goal.id)}>
                  <Text style={{ fontSize: 12, color: Colors.textMuted, paddingHorizontal: 4 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              style={styles.inlineInput}
              value={newCheckText}
              onChangeText={setNewCheckText}
              placeholder="+ Add checklist goal..."
              placeholderTextColor={Colors.textMuted}
              onSubmitEditing={() => {
                if (newCheckText.trim()) {
                  addChecklistGoal(newCheckText.trim())
                  setNewCheckText('')
                }
              }}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* ─── 5-Year Vision ─── */}
        <View>
          <Text style={styles.sectionLabel}>5-Year Vision ({currentYear}–{currentYear + 4})</Text>
          <View style={styles.visionSection}>
            {AREAS.map(area => {
              const vision = getVision(area)
              if (vision.goals.length === 0) return null
              return (
                <View key={area}>
                  <View style={styles.areaHeader}>
                    <View style={[styles.areaDot, { backgroundColor: AREA_COLOR[area] }]} />
                    <Text style={styles.areaLabel}>{AREA_LABEL[area]}</Text>
                  </View>
                  <View style={styles.visionCard}>
                    {vision.goals.map((goal, i) => (
                      <TouchableOpacity
                        key={goal.id}
                        onLongPress={() =>
                          Alert.alert('Delete goal?', goal.title, [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => deleteVisionGoal(area, goal.id) },
                          ])
                        }
                        activeOpacity={0.8}
                      >
                        <View style={[
                          styles.visionRow,
                          i === vision.goals.length - 1 && styles.visionRowLast,
                        ]}>
                          <TouchableOpacity onPress={() => toggleVisionGoal(area, goal.id)}>
                            <View style={[styles.squareBox, goal.done && styles.squareBoxDone]}>
                              {goal.done && <Text style={styles.squareTick}>✓</Text>}
                            </View>
                          </TouchableOpacity>
                          <Text style={[styles.visionTitle, goal.done && styles.visionTitleDone]}>
                            {goal.title}
                          </Text>
                          {goal.year && (
                            <Text style={styles.visionYear}>{goal.year}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )
            })}
            <TouchableOpacity style={styles.addBtn} onPress={openAddVision}>
              <Text style={styles.addBtnText}>+ Add 5-year goal...</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* ─── Add measurable goal modal ─── */}
      <Sheet visible={showAddM} onClose={() => setShowAddM(false)}
        title={editingM ? 'Edit Goal' : 'New Measurable Goal'}>
        <Text style={styles.modalFieldLabel}>Title</Text>
        <TextInput
          style={styles.modalField}
          value={mTitle}
          onChangeText={setMTitle}
          placeholder="e.g. Run a half marathon"
          placeholderTextColor={Colors.textMuted}
          autoFocus
        />
        <View style={styles.modalRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.modalFieldLabel}>Current</Text>
            <TextInput
              style={styles.modalField}
              value={mCurrent}
              onChangeText={setMCurrent}
              placeholder="6"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modalFieldLabel}>Target</Text>
            <TextInput
              style={styles.modalField}
              value={mTarget}
              onChangeText={setMTarget}
              placeholder="24"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modalFieldLabel}>% (override)</Text>
            <TextInput
              style={styles.modalField}
              value={mProgress}
              onChangeText={setMProgress}
              placeholder="40"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
        <TouchableOpacity style={styles.modalSaveBtn} onPress={saveMeasurable}>
          <Text style={styles.modalSaveBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowAddM(false)}>
          <Text style={styles.modalCancelText}>Cancel</Text>
        </TouchableOpacity>
      </Sheet>

      {/* ─── Add 5-year vision goal modal ─── */}
      <Sheet visible={showAddV} onClose={() => setShowAddV(false)} title="New 5-Year Goal">
        <Text style={styles.modalFieldLabel}>Area</Text>
        <View style={styles.areaPicker}>
          {AREAS.map(a => (
            <TouchableOpacity
              key={a}
              style={[styles.areaChip, vArea === a && styles.areaChipActive]}
              onPress={() => setVArea(a)}
            >
              <Text style={[styles.areaChipText, vArea === a && styles.areaChipTextActive]}>
                {AREA_LABEL[a]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.modalFieldLabel}>Goal</Text>
        <TextInput
          style={styles.modalField}
          value={vTitle}
          onChangeText={setVTitle}
          placeholder="e.g. Launch a side project"
          placeholderTextColor={Colors.textMuted}
          autoFocus
        />
        <View style={styles.modalRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.modalFieldLabel}>Target year</Text>
            <TextInput
              style={styles.modalField}
              value={vYear}
              onChangeText={setVYear}
              placeholder="2028"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
        <TouchableOpacity style={styles.modalSaveBtn} onPress={saveVision}>
          <Text style={styles.modalSaveBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowAddV(false)}>
          <Text style={styles.modalCancelText}>Cancel</Text>
        </TouchableOpacity>
      </Sheet>

    </View>
  )
}
