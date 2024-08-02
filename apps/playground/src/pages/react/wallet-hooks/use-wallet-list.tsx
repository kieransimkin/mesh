import { useWalletList } from "@meshsdk/react";

import LiveCodeDemo from "~/components/sections/live-code-demo";
import TwoColumnsScroll from "~/components/sections/two-columns-scroll";
import Codeblock from "~/components/text/codeblock";

export default function ReactHookUseWalletList() {
  return (
    <TwoColumnsScroll
      sidebarTo="useWalletList"
      title="useWalletList Hook"
      leftSection={Left()}
      rightSection={Right()}
    />
  );
}

function Left() {
  let code1 = `const wallets = useWalletList();`;

  return (
    <>
      <p>Returns a list of wallets installed on user's device.</p>
      <Codeblock data={code1} isJson={false} />
    </>
  );
}

function Right() {
  const wallets = useWalletList();

  let code3 = `import { useWalletList } from '@meshsdk/react';\n\n`;
  code3 += `export default function Page() {\n`;
  code3 += `  const wallets = useWalletList();\n\n`;
  code3 += `  return (\n`;
  code3 += `    <>\n`;
  code3 += `      {wallets.map((wallet, i) => {\n`;
  code3 += `        return (\n`;
  code3 += `          <p key={i}>\n`;
  code3 += `            <img src={wallet.icon} style={{ width: '48px' }} />\n`;
  code3 += `            <b>{wallet.name}</b>\n`;
  code3 += `          </p>\n`;
  code3 += `        );\n`;
  code3 += `      })}\n`;
  code3 += `    </>\n`;
  code3 += `  );\n`;
  code3 += `}\n`;

  return (
    <LiveCodeDemo
      title="useWalletList Hook"
      subtitle="List of wallets installed on user's device"
      code={`const wallets = useWalletList();\nconsole.log(wallets);`}
      childrenAfterCodeFunctions={true}
    >
      <>
        <Codeblock data={wallets} isJson={true} />

        <Codeblock data={code3} isJson={false} />

        {wallets.map((wallet, i) => {
          return (
            <p key={i}>
              <img src={wallet.icon} style={{ width: "48px" }} />
              <b>{wallet.name}</b>
            </p>
          );
        })}
      </>
    </LiveCodeDemo>
  );
}
