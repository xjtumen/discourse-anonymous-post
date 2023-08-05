export default function getTheme() {
  let theme = settings.theme;

  if (theme === "auto") {
    if (window?.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    } else {
      theme = "light";
    }
  }

  return theme;
}
