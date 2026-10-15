import kitCss from '../styles/styles.build.css?inline';
import tailwindPreflight from 'tailwindcss/preflight.css?raw';

export interface HostApp {
  name: string;
  css: string;
  /** Tags the host styles globally (unlayered). Those beat the kit's plain-tag styles on purpose: old styles always win. */
  hostStyledTags: ('h2' | 'a')[];
}

const resolveThemeFallbacks = (css: string): string =>
  css.replace(/--theme\(\s*--[\w-]+\s*,\s*([\s\S]*?)\)\s*;/g, '$1;');

export const HOSTS: Record<string, HostApp> = {
  plain: {
    name: 'Plain CSS app',
    hostStyledTags: ['a'],
    css: `
      body { margin: 24px; font-family: Georgia, serif; color: #333; background: #fafafa; }
      a { color: #0645ad; }
    `,
  },
  tailwind: {
    name: 'Tailwind v4 app (its own reset in @layer base)',
    hostStyledTags: [],
    css: `
      @layer theme, base, components, utilities;
      @layer base { ${resolveThemeFallbacks(tailwindPreflight)} }
      @layer utilities { .text-red-600 { color: #dc2626; } }
    `,
  },
  bootstrap: {
    name: 'Bootstrap-style app (unlayered global tag styles)',
    hostStyledTags: ['h2', 'a'],
    css: `
      *, ::before, ::after { box-sizing: border-box; }
      body { margin: 0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 1rem;
        line-height: 1.5; color: #212529; background-color: #fff; }
      h1, h2, h3, h4, h5, h6 { margin-top: 0; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2; }
      h1 { font-size: 2.5rem; }
      h2 { font-size: 2rem; }
      p { margin-top: 0; margin-bottom: 1rem; }
      a { color: #0d6efd; text-decoration: underline; }
    `,
  },
};

const PAGE = `
  <div id="host">
    <h1 id="host-h1">Legacy page title</h1>
    <p id="host-p">Legacy paragraph with a <a id="host-a" href="#">legacy link</a>.</p>
    <ul id="host-ul"><li>Legacy list item</li></ul>
    <button id="host-button" type="button">Legacy button</button>
  </div>
  <section id="kit" class="skit-root" style="margin-top: 24px; padding: 16px">
    <h2 id="kit-h2">Kit heading (plain tag)</h2>
    <p id="kit-p">Kit paragraph with a <a id="kit-a" href="#">kit link</a>.</p>
    <h2 id="kit-h2-class" class="skit:text-title">Kit heading with skit:text-title</h2>
    <p id="kit-p-class" class="skit:text-heading">Paragraph with skit:text-heading</p>
  </section>
`;

interface Check {
  label: string;
  expected: string;
  actual: string;
  pass: boolean;
}

const HOST_PROPS: [string, string[]][] = [
  ['html', ['color-scheme', 'font-family']],
  ['body', ['font-family', 'background-color', 'color', 'margin-top']],
  ['#host-h1', ['font-size', 'font-weight', 'margin-bottom']],
  ['#host-p', ['font-family', 'margin-bottom']],
  ['#host-a', ['color']],
  ['#host-ul', ['list-style-type', 'padding-left']],
  ['#host-button', ['background-color', 'font-family']],
];

const frame = (target: HTMLElement, title: string, css: string): Promise<Document> =>
  new Promise((resolve) => {
    const figure = document.createElement('figure');
    figure.style.margin = '0';
    figure.innerHTML = `<figcaption class="skit:mb-2 skit:text-label">${title}</figcaption>`;
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 100%; height: 420px; border: 1px solid var(--skit-border); border-radius: 12px';
    iframe.srcdoc = `<!doctype html><html><head><style>${css}</style></head><body>${PAGE}</body></html>`;
    iframe.addEventListener('load', () => resolve(iframe.contentDocument!));
    figure.append(iframe);
    target.append(figure);
  });

const style = (doc: Document, selector: string, prop: string): string =>
  doc.defaultView!.getComputedStyle(doc.querySelector(selector)!).getPropertyValue(prop);

const escape = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const resolveColor = (doc: Document, value: string): string => {
  const probe = doc.createElement('span');
  probe.style.color = value;
  doc.body.append(probe);
  const color = doc.defaultView!.getComputedStyle(probe).color;
  probe.remove();
  return color;
};

export async function runCompatibility(target: HTMLElement, host: HostApp): Promise<Check[]> {
  target.replaceChildren();
  const frames = document.createElement('div');
  frames.className = 'skit:grid skit:gap-4 skit:lg:grid-cols-2';
  target.append(frames);

  const [before, after] = await Promise.all([
    frame(frames, 'Host app alone', host.css),
    frame(frames, 'Host app + kit CSS', host.css + kitCss),
  ]);

  const checks: Check[] = [];

  for (const [selector, props] of HOST_PROPS) {
    for (const prop of props) {
      const expected = style(before, selector, prop);
      const actual = style(after, selector, prop);
      checks.push({ label: `Host ${selector} ${prop} unchanged`, expected, actual, pass: expected === actual });
    }
  }

  const kit = (selector: string, prop: string, kitValue: string, label: string, hostTag?: 'h2' | 'a'): void => {
    const hostWins = hostTag !== undefined && host.hostStyledTags.includes(hostTag);
    const expected = hostWins ? style(before, selector, prop) : kitValue;
    const actual = style(after, selector, prop);
    checks.push({ label: `${label} (${hostWins ? 'host wins' : 'kit applies'})`, expected, actual, pass: actual === expected });
  };

  const linkColor = resolveColor(after, style(after, '#kit', '--skit-link').trim());
  kit('#kit-h2', 'font-size', '24px', 'Plain <h2> inside .skit-root', 'h2');
  kit('#kit-a', 'color', linkColor, 'Plain <a> inside .skit-root', 'a');
  kit('#kit-p', 'font-family', 'Inter, ui-sans-serif, system-ui, sans-serif', 'Inter inside .skit-root');
  kit('#kit-p-class', 'font-size', '24px', 'skit:text-heading on <p>');
  kit('#kit-h2-class', 'font-size', '20px', 'skit:text-title on <h2>', 'h2');

  const rows = checks
    .map(
      (c) => `<tr>
        <td>${c.pass ? '✅' : '❌'}</td><td>${escape(c.label)}</td>
        <td><code>${escape(c.expected)}</code></td><td><code>${escape(c.actual)}</code></td>
      </tr>`,
    )
    .join('');
  const passed = checks.filter((c) => c.pass).length;
  const report = document.createElement('div');
  report.className = 'skit:mt-6';
  report.innerHTML = `
    <h3>${passed} / ${checks.length} checks passed</h3>
    <table>
      <thead><tr><th></th><th>Check</th><th>Expected</th><th>Actual</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  target.append(report);
  return checks;
}
