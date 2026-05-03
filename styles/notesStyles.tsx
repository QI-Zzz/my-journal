import { StyleSheet } from 'react-native'
import { Colors, FontSize, Radius, Spacing, TabColors } from '../constants/theme'

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content:   { paddingHorizontal: Spacing.lg, paddingBottom: 80 },

  // ─── Hero ───────────────────────────────────────────────
  hero: {
    backgroundColor: TabColors.notes,
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
  },

  // ─── Note cards ─────────────────────────────────────────
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  noteCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  noteTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  noteBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  noteDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 6,
  },
  addCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    marginBottom: Spacing.sm,
  },
  addCardText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },

  // ─── Modal editor ────────────────────────────────────────
  modal: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  modalHeaderBtn: {
    fontSize: FontSize.md,
    color: TabColors.notes,
    fontWeight: '600',
  },
  modalDelete: {
    fontSize: FontSize.md,
    color: Colors.danger,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    letterSpacing: -0.3,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bodyInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    textAlignVertical: 'top',
    lineHeight: 24,
    backgroundColor: Colors.background,
  },
})
