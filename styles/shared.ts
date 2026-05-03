// Shared style tokens reused across every tab.
// Import these instead of re-defining hero/section styles per file.
import { StyleSheet } from 'react-native'
import { Colors, FontSize, Radius, Spacing } from '../constants/theme'

export const shared = StyleSheet.create({
  // ─── Page shell ─────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 80,
  },

  // ─── Hero (override backgroundColor per tab) ────────────
  hero: {
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
  heroNavLabel: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.5)',
  },

  // ─── Section label ──────────────────────────────────────
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },

  // ─── Generic card ───────────────────────────────────────
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },

  // ─── Divider row inside a card ─────────────────────────
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  cardRowLast: {
    borderBottomWidth: 0,
  },

  // ─── Dark CTA button ────────────────────────────────────
  darkBtn: {
    backgroundColor: '#111',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  darkBtnText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#fff',
  },

  // ─── Inline text input ──────────────────────────────────
  inlineInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  // ─── Date-picker modal overlay ──────────────────────────
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    margin: Spacing.xl,
  },
})
