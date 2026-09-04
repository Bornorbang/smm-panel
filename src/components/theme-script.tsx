export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('smm-panel-theme')||'light';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
