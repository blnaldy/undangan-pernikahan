

// Theme Switcher
class ThemeSwitcher {
  constructor() {
    this.currentTheme = 'default';
    this.themes = ['default', 'red'];
    this.init();
  }

  init() {
    this.createThemeButton();
    this.loadSavedTheme();
  }

  createThemeButton() {
    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggle';
    themeBtn.className = 'theme-btn';
    themeBtn.innerHTML = '<i class="fas fa-palette"></i>';
    themeBtn.title = 'Ganti Tema';
    
    // Style the button
    themeBtn.style.cssText = `
      position: fixed;
      top: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--white);
      border: 2px solid var(--rose);
      border-radius: 50%;
      cursor: pointer;
      z-index: 1001;
      display: flex;
      align-items: center;
