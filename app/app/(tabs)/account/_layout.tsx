import { Stack } from 'expo-router';

/**
 * Het accountgedeelte is een stapel schermen: de hub met het menu, en daarboven
 * de losse schermen die je opent. De tabbalk onderaan blijft zichtbaar.
 */
export default function AccountLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
