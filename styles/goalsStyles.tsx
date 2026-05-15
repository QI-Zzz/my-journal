import { StyleSheet } from 'react-native'
import { Colors, FontSize, Radius, Spacing, TabColors } from '../constants/theme'

export const styles = StyleSheet.create({
  // ─── Layout ─────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 80,
    gap: Spacing.xl,
  },

  // ─── Hero ───────────────────────────────────────────────
  hero: {
    backgroundColor: TabColors.goals,
    paddingTop: 52,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  heroLabel: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  heroNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroNavBtn: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.sm,
  },
  heroNavYear: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },

  // ─── Days left card ──────────────────────────────────────
  daysCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  daysNumber: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  daysLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },

  // ─── Section header ──────────────────────────────────────
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },

  // ─── Measurable goals ────────────────────────────────────
  goalCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 8,
  },
  goalCardGap: {
    gap: Spacing.sm,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  goalTitleDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  goalProgress: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  track: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: Radius.full,
  },

  // ─── Dark add button ─────────────────────────────────────
  addBtn: {
    backgroundColor: '#1E90FF',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  addBtnText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ─── Checklist ───────────────────────────────────────────
  checklistCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  checkRowLast: {
    borderBottomWidth: 0,
  },
  circleBox: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBoxDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkTick: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  checkTextDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  inlineInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },

  // ─── 5-Year vision ───────────────────────────────────────
  visionSection: {
    gap: Spacing.md,
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  areaDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  areaLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  visionCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  visionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  visionRowLast: {
    borderBottomWidth: 0,
  },
  squareBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareBoxDone: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  squareTick: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  visionTitle: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  visionTitleDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  visionYear: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    width: 32,
    textAlign: 'right',
  },

  // ─── Modal ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalField: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  modalFieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  modalRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalSaveBtn: {
    backgroundColor: '#1E90FF',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#fff',
  },
  modalCancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  areaPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  areaChip: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  areaChipActive: {
    borderColor: Colors.textPrimary,
    backgroundColor: Colors.textPrimary,
  },
  areaChipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  areaChipTextActive: {
    color: '#fff',
  },
})
