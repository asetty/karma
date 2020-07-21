import React, { FC } from "react";

import { useObserver } from "mobx-react-lite";

import { APIAlertGroupT } from "Models/APITypes";
import { StaticLabels } from "Common/Query";
import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { FilteringLabel } from "Components/Labels/FilteringLabel";
import { RenderNonLinkAnnotation, RenderLinkAnnotation } from "../Annotation";
import { RenderSilence } from "../Silences";

const GroupFooter: FC<{
  group: APIAlertGroupT;
  alertmanagers: string[];
  afterUpdate: () => void;
  alertStore: AlertStore;
  silenceFormStore: SilenceFormStore;
}> = ({ group, alertmanagers, afterUpdate, alertStore, silenceFormStore }) => {
  return useObserver(() => (
    <div className="card-footer components-grid-alertgrid-alertgroup-footer px-2 py-1">
      <div className="mb-1">
        {group.shared.annotations
          .filter((a) => a.isLink === false)
          .map((a) => (
            <RenderNonLinkAnnotation
              key={a.name}
              name={a.name}
              value={a.value}
              visible={a.visible}
              afterUpdate={afterUpdate}
            />
          ))}
      </div>
      {Object.entries(group.shared.labels).map(([name, value]) => (
        <FilteringLabel
          key={name}
          name={name}
          value={value}
          alertStore={alertStore}
        />
      ))}
      {alertmanagers.map((cluster) => (
        <FilteringLabel
          key={cluster}
          name={StaticLabels.AlertmanagerCluster}
          value={cluster}
          alertStore={alertStore}
        />
      ))}
      {alertStore.data.receivers.length > 1 ? (
        <FilteringLabel
          name={StaticLabels.Receiver}
          value={group.receiver}
          alertStore={alertStore}
        />
      ) : null}
      {group.shared.annotations
        .filter((a) => a.isLink === true)
        .map((a) => (
          <RenderLinkAnnotation key={a.name} name={a.name} value={a.value} />
        ))}
      {Object.keys(group.shared.silences).length === 0 ? null : (
        <div className="components-grid-alertgrid-alertgroup-shared-silence rounded-0 border-0">
          {Object.entries(group.shared.silences).map(([cluster, silences]) =>
            silences.map((silenceID) => (
              <RenderSilence
                key={silenceID}
                alertStore={alertStore}
                silenceFormStore={silenceFormStore}
                afterUpdate={afterUpdate}
                cluster={cluster}
                silenceID={silenceID}
              />
            ))
          )}
        </div>
      )}
    </div>
  ));
};

export { GroupFooter };