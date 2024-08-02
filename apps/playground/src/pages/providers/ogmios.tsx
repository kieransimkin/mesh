import type { NextPage } from "next";
import Link from "next/link";

import { OgmiosProvider } from "@meshsdk/core";

import SidebarFullwidth from "~/components/layouts/sidebar-fullwidth";
import TitleIconDescriptionBody from "~/components/sections/title-icon-description-body";
import Metatags from "~/components/site/metatags";
import Codeblock from "~/components/text/codeblock";
import { metaOgmios } from "~/data/links-providers";
import { useProviders } from "~/hooks/useProviders";
import ProviderEvaluators from "./evaluators";
import ProviderSubmitters from "./submitters";

const ReactPage: NextPage = () => {
  const sidebarItems = [
    { label: "Evaluate Tx", to: "evaluateTx" },
    { label: "Submit Tx", to: "submitTx" },
  ];

  let code1 = `import { OgmiosProvider } from "@meshsdk/core";\n\n`;
  code1 += `const blockchainProvider = new OgmiosProvider('<URL>');`;

  const ogmiosUrl = useProviders((state) => state.ogmiosUrl);

  const blockchainProvider = new OgmiosProvider(ogmiosUrl);

  return (
    <>
      <Metatags title={metaOgmios.title} description={metaOgmios.desc} />
      <SidebarFullwidth sidebarItems={sidebarItems}>
        <TitleIconDescriptionBody
          title={metaOgmios.title}
          description={metaOgmios.desc}
        >
          <p>
            <Link href="https://ogmios.dev/" target="_blank" rel="noreferrer">
              Ogmios
            </Link>{" "}
            is a lightweight bridge interface for cardano-node. It offers a
            WebSockets API that enables local clients to speak Ouroboros'
            mini-protocols via JSON/RPC. Ogmios is a fast and lightweight
            solution that can be deployed alongside relays to create entry
            points on the Cardano network for various types of applications.
          </p>

          <p>Get started:</p>
          <Codeblock data={code1} />
        </TitleIconDescriptionBody>

        <ProviderEvaluators
          blockchainProvider={blockchainProvider}
          provider="ogmios"
        />
        <ProviderSubmitters
          blockchainProvider={blockchainProvider}
          provider="ogmios"
        />
      </SidebarFullwidth>
    </>
  );
};

export default ReactPage;
