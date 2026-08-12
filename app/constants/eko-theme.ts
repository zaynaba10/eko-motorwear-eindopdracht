/**
 * EKO Motorwear — design tokens
 * Overgenomen uit de definitieve Webflow-huisstijl (navy #16232e, oranje #BD5C00, sectiegrijs #ECEDEF).
 * Zie: Design-tokens-EKO-Motorwear.md
 */

export const EkoColors = {
  primaryDark: '#16232e',
  primary: '#BD5C00',
  paragraphGray: '#535353',
  primaryLight: '#ECEDEF',
  lightGray: '#ECEDEF',
  lightSteelBlue: '#D8DBE0',
  gray: '#D8DBE0',
  darkGray: '#afafaf',
  white: '#ffffff',
  black: '#000000',
  whiteTranslucent: 'rgba(255,255,255,0.9)',
} as const;

export const EkoFonts = {
  headingBold: 'Oswald_700Bold',
  headingMedium: 'Oswald_500Medium',
  headingRegular: 'Oswald_400Regular',
  bodyRegular: 'Ubuntu_400Regular',
  bodyMedium: 'Ubuntu_500Medium',
  bodyBold: 'Ubuntu_700Bold',
} as const;

export const EkoRadius = {
  pill: 30,
  card: 30,
  tag: 20,
  small: 10,
} as const;

export const EkoSpacing = {
  sectionVertical: 48,
  sectionVerticalSmall: 32,
  containerHorizontal: 16,
  gap: 16,
} as const;

export const EkoTypography = {
  h1: { fontFamily: EkoFonts.headingBold, fontSize: 40, letterSpacing: 1.5, lineHeight: 46, color: EkoColors.primaryDark },
  h2: { fontFamily: EkoFonts.headingBold, fontSize: 28, letterSpacing: 1, lineHeight: 34, color: EkoColors.primaryDark },
  h3: { fontFamily: EkoFonts.headingBold, fontSize: 22, letterSpacing: 1, lineHeight: 28, color: EkoColors.primaryDark },
  h5: { fontFamily: EkoFonts.headingBold, fontSize: 16, letterSpacing: 1, lineHeight: 22, color: EkoColors.primaryDark },
  body: { fontFamily: EkoFonts.bodyRegular, fontSize: 15, lineHeight: 22, color: EkoColors.paragraphGray },
  bodyWhite: { fontFamily: EkoFonts.bodyRegular, fontSize: 15, lineHeight: 22, color: EkoColors.white },
} as const;

export const EkoButton = {
  base: {
    backgroundColor: EkoColors.primary,
    borderRadius: EkoRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  text: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    color: EkoColors.primaryDark,
    textTransform: 'uppercase' as const,
  },
} as const;
