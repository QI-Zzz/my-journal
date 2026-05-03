import { StyleSheet } from 'react-native'
import { Colors, FontSize, Radius, Spacing, TabColors } from '../constants/theme'

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content:   { paddingHorizontal: Spacing.lg, paddingBottom: 80 },

  // ─── Hero ───────────────────────────────────────────────
  hero: {
    backgroundColor: TabColors.year,
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

  // ─── View toggle ─────────────────────────────────────────
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    padding: 3,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  toggleBtnActive: {
    backgroundColor: TabColors.year,
  },
  toggleText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: '#fff',
  },

  // ─── Section label ───────────────────────────────────────
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },

  // ─── Summary cards ───────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  summaryValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: TabColors.year,
  },
  summaryLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // ─── Month strip ─────────────────────────────────────────
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  monthLabel: {
    width: 30,
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginRight: 6,
  },
  daySquaresRow: {
    flexDirection: 'row',
    gap: 1,
    flex: 1,
  },
  daySquare: {
    width: 9,
    height: 9,
    borderRadius: 2,
  },

  // ─── Legend ──────────────────────────────────────────────
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
})
