import { StyleSheet } from 'react-native'
import { Colors, FontSize, Radius, Spacing, TabColors } from '../constants/theme'

export const styles = StyleSheet.create({
  // ─── Layout ─────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 60,
  },

  // ─── Hero ───────────────────────────────────────────────
  hero: {
    backgroundColor: TabColors.calendar,
    paddingTop: 32,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  heroLabel: {
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
    marginBottom: Spacing.md,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  navBtn: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.sm,
  },
  navLabel: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.55)',
  },

  // ─── Section ────────────────────────────────────────────
  section: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },

  // ─── Calendar Grid ──────────────────────────────────────
  gridSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  gridLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  gridCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingVertical: Spacing.sm,
  },
  weekRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  weekRowLast: {
    borderBottomWidth: 0,
  },
  cell: {
    flex: 1,
    height: 58,
    paddingTop: 6,
    paddingLeft: 5,
    borderRightWidth: 0.5,
    borderRightColor: Colors.border,
    backgroundColor: Colors.background,
  },
  cellLast: {
    borderRightWidth: 0,
  },
  cellEmpty: {
    backgroundColor: Colors.surface,
  },
  cellToday: {
    backgroundColor: '#E8F5E9',
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dayNumberToday: {
    color: TabColors.calendar,
    fontWeight: '700',
  },
  cellWord: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cellWordFilled: {
    color: TabColors.calendar,
    fontWeight: '500',
  },
  todayLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: TabColors.calendar,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 1,
  },

  // ─── Mood Distribution ──────────────────────────────────
  moodChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 90,
    gap: Spacing.sm,
  },
  moodBarCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 90,
  },
  moodBarCount: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  moodBar: {
    width: '70%',
    borderRadius: 4,
    backgroundColor: TabColors.calendar,
  },
  moodEmoji: {
    fontSize: 18,
    marginTop: Spacing.xs,
  },

  // ─── Monthly Averages ────────────────────────────────────
  avgGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  avgCard: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  avgValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  avgLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  deltaPos: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.success,
  },
  deltaNeg: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.danger,
  },
  deltaZero: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  // ─── Habit Completion ────────────────────────────────────
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: Spacing.sm,
  },
  habitName: {
    width: 118,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  habitFraction: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    width: 34,
    textAlign: 'right',
  },
  habitTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  habitFill: {
    height: 6,
    backgroundColor: TabColors.calendar,
    borderRadius: Radius.full,
  },

  // ─── Date picker modal ──────────────────────────────────
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
  },

  // ─── Day-word modal ──────────────────────────────────────
  wordOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  wordSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.lg,
    paddingBottom: 36,
    gap: Spacing.md,
  },
  wordSheetTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  wordInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  wordSaveBtn: {
    backgroundColor: TabColors.calendar,
    borderRadius: Radius.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  wordSaveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FontSize.md,
  },

  // ─── 2×2 Habit grid ─────────────────────────────────────
  habitGrid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  habitGridCell: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  habitGridCount: {
    fontSize: 28,
    fontWeight: '700',
    color: TabColors.calendar,
  },
  habitGridLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // ─── Monthly Todos ───────────────────────────────────────
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
    gap: Spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: TabColors.calendar,
    borderColor: TabColors.calendar,
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
})
