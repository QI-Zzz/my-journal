import { StyleSheet } from 'react-native'
import { Colors, FontSize, Radius, Spacing, TabColors } from '../constants/theme'

export const styles = StyleSheet.create({
  // ─── Layout ─────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 60,
  },

  // ─── Hero ───────────────────────────────────────────────
  hero: {
    backgroundColor: TabColors.weekly,
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

  // ─── Sections ───────────────────────────────────────────
  section: {
    paddingVertical: Spacing.lg,
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

  // ─── Highlights ─────────────────────────────────────────
  highlightGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: TabColors.weekly,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // ─── Mood Strip ─────────────────────────────────────────
  stripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dayLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  moodEmoji: {
    fontSize: 22,
  },
  moodEmpty: {
    fontSize: 16,
    color: Colors.textMuted,
    lineHeight: 26,
  },

  // ─── Habit Tracker ──────────────────────────────────────
  habitHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  habitNameCell: {
    width: 86,
  },
  habitDayLabels: {
    flex: 1,
    flexDirection: 'row',
  },
  habitDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  habitName: {
    width: 86,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  habitDots: {
    flex: 1,
    flexDirection: 'row',
  },
  habitDotWrap: {
    flex: 1,
    alignItems: 'center',
  },
  habitDot: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.background,
  },
  habitDotDone: {
    backgroundColor: TabColors.weekly,
    borderColor: TabColors.weekly,
  },
  habitDotNull: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },

  // ─── Date picker modal ─────────────────────────────────
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

  // ─── Todos ──────────────────────────────────────────────
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
    backgroundColor: TabColors.weekly,
    borderColor: TabColors.weekly,
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
