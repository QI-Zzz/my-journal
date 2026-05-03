import { StyleSheet } from 'react-native'
import { Colors, FontSize, Radius, Spacing, TabColors } from '../constants/theme'

export const styles = StyleSheet.create({
  // ─── Layout ────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 60,
  },

  // ─── Hero Header ───────────────────────────────────────
  hero: {
    backgroundColor: TabColors.today,
    paddingTop: 32,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  heroDate: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },

  // ─── Sections ──────────────────────────────────────────
  section: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  titles: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  // ─── Todos ─────────────────────────────────────────────
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
    gap: Spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: TabColors.today,
    borderColor: TabColors.today,
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  todoText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  todoTextDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  deleteBtn: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.xs,
  },
  input: {
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    marginTop: Spacing.xs,
  },

  // ─── Daily Log Toggles ─────────────────────────────────
  boolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  boolLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  toggle: {
    width: 38,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: TabColors.today,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },

  // ─── Chips ─────────────────────────────────────────────
  chipLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignSelf:'flex-start',
  },
  chipActive: {
    borderColor: TabColors.today,
    backgroundColor: '#FFF0F0',
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: TabColors.today,
  },

  // ─── Food ──────────────────────────────────────────────
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
    gap: Spacing.sm,
  },
  mealBadge: {
    fontSize: FontSize.xs,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: Radius.full,
    fontWeight: '600',
    overflow: 'hidden',
  },
  foodText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  // ─── Mood ──────────────────────────────────────────────
  moodRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  moodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
  },
  moodBtnActive: {
    borderColor: TabColors.today,
    backgroundColor: '#FFF0F0',
  },
  moodEmoji: {
    fontSize: 24,
  },

  // ─── Weather ───────────────────────────────────────────
  weatherRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  weatherChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignSelf:'flex-start',
  },
  weatherChipActive: {
    borderColor: TabColors.today,
    backgroundColor: '#FFF0F0',
  },
  weatherChipText: {
    fontSize: FontSize.xl,
  },

  // ─── Time Tracking ─────────────────────────────────────
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  timeLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  timeValue: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: TabColors.today,
  },
  timeInput: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: TabColors.today,
    textAlign: 'right',
    minWidth: 50,
  },

  // ─── Battery ───────────────────────────────────────────
  batteryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  batteryBody: {
    flexDirection: 'row',
    gap: 3,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  batteryTip: {
    width: 2.5,
    height: 7,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  batterySegment: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#e8e8e8',
  },
  batterySegmentFilled: {
    backgroundColor: TabColors.today,
  },

  // ─── Stars ─────────────────────────────────────────────
  starRow: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    fontSize: 18,
  },

  // ─── Gratitude ─────────────────────────────────────────
  gratitudeInput: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 22,
  },

  // ─── Misc ──────────────────────────────────────────────
  placeholder: {
    color: Colors.textMuted,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
})