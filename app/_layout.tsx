import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";

import { ErrorBoundary } from "./error-boundary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useThemeStore } from "@/store/themeStore";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { colors, mode } = useThemeStore();

  useEffect(() => {
    // Update status bar style based on theme
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(mode === 'dark' ? 'light-content' : 'dark-content', true);
    } else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.background, true);
      StatusBar.setBarStyle(mode === 'dark' ? 'light-content' : 'dark-content', true);
    }
  }, [mode, colors.background]);

  return (
    <>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerBackTitle: "Назад",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontWeight: "600",
            color: colors.text,
          },
          headerTintColor: colors.primary,
          headerRight: () => <ThemeToggle />,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Модальное окно" }} />
      </Stack>
    </>
  );
}