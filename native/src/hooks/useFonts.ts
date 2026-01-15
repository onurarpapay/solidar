import { useFonts } from 'expo-font';

export const useLoadFonts = async () => {
  const [fontsLoaded, fontError] = useFonts({
    'Segoe-UI': require('../assets/fonts/segoe-ui.ttf'),
  });

  return { fontsLoaded, fontError };
};
