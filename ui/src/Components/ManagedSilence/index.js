import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useObserver, useLocalStore } from "mobx-react";

import { motion } from "framer-motion";

import { APISilence } from "Models/API";
import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore, SilenceTabNames } from "Stores/SilenceFormStore";
import { SilenceComment } from "./SilenceComment";
import { SilenceDetails } from "./SilenceDetails";

const GetAlertmanager = (alertStore, cluster) =>
  alertStore.data.readWriteAlertmanagers
    .filter((u) => u.cluster === cluster)
    .slice(0, 1)[0];

const ManagedSilence = ({
  cluster,
  alertCount,
  alertCountAlwaysVisible,
  silence,
  alertStore,
  silenceFormStore,
  isOpen,
  onDidUpdate,
  onDeleteModalClose,
}) => {
  useEffect(() => {
    if (onDidUpdate) onDidUpdate();
  });

  const collapse = useLocalStore(() => ({
    value: !isOpen,
    toggle() {
      this.value = !this.value;
    },
  }));

  const onEditSilence = () => {
    const alertmanager = GetAlertmanager(alertStore, cluster);

    silenceFormStore.data.fillFormFromSilence(alertmanager, silence);
    silenceFormStore.data.resetProgress();
    silenceFormStore.tab.setTab(SilenceTabNames.Editor);
    silenceFormStore.toggle.show();
  };

  return useObserver(() => (
    <motion.div
      animate={{ opacity: [0, 1] }}
      className="card my-1 components-managed-silence"
    >
      <div className="card-header rounded-0 border-bottom-0 px-3">
        <SilenceComment
          alertStore={alertStore}
          cluster={cluster}
          silence={silence}
          alertCount={alertCount}
          alertCountAlwaysVisible={alertCountAlwaysVisible}
          collapsed={collapse.value}
          collapseToggle={collapse.toggle}
        />
      </div>

      {collapse.value ? null : (
        <div className="card-body pt-0">
          <SilenceDetails
            cluster={cluster}
            silence={silence}
            alertStore={alertStore}
            silenceFormStore={silenceFormStore}
            onEditSilence={onEditSilence}
            onDeleteModalClose={onDeleteModalClose}
          />
        </div>
      )}
    </motion.div>
  ));
};
ManagedSilence.propTypes = {
  cluster: PropTypes.string.isRequired,
  alertCount: PropTypes.number.isRequired,
  alertCountAlwaysVisible: PropTypes.bool.isRequired,
  silence: APISilence.isRequired,
  alertStore: PropTypes.instanceOf(AlertStore).isRequired,
  silenceFormStore: PropTypes.instanceOf(SilenceFormStore).isRequired,
  onDidUpdate: PropTypes.func,
  onDeleteModalClose: PropTypes.func,
  isOpen: PropTypes.bool,
};
ManagedSilence.defaultProps = {
  isOpen: false,
};

export { ManagedSilence, GetAlertmanager };
