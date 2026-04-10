import { create } from 'zustand';
import type { AttackScenario, AttackStep, AttackAnimationState } from '@/lib/types';
import { useScenarioStore } from './scenarioStore';
import { WALKTHROUGH_TIMING } from '@/lib/constants';

interface WalkthroughState {
  status: AttackAnimationState;
  scenario: AttackScenario | null;
  currentStepIndex: number;
  speed: number;

  loadScenario: (scenario: AttackScenario) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToStep: (index: number) => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

function applyStep(step: AttackStep) {
  const scenarioStore = useScenarioStore.getState();
  step.affectedNodeIds.forEach((nodeId) => {
    scenarioStore.setNodeState(nodeId, step.nodeState);
  });
  if (step.edgeIds && step.edgeIds.length > 0) {
    scenarioStore.setAttackPathEdges(step.edgeIds);
  }
  scenarioStore.setHighlightedNodes(step.affectedNodeIds);
}

function clearStates() {
  const scenarioStore = useScenarioStore.getState();
  scenarioStore.resetNodeStates();
  scenarioStore.clearAttackPathEdges();
}

export const useWalkthroughStore = create<WalkthroughState>((set, get) => ({
  status: 'idle',
  scenario: null,
  currentStepIndex: -1,
  speed: WALKTHROUGH_TIMING.defaultSpeed,

  loadScenario: (scenario) => {
    clearStates();
    set({ scenario, currentStepIndex: -1, status: 'idle' });
  },

  play: () => {
    const { status, scenario, currentStepIndex } = get();
    if (!scenario) return;
    if (status === 'finished') {
      clearStates();
      set({ currentStepIndex: -1 });
    }
    set({ status: 'playing' });
    if (currentStepIndex < 0) {
      get().stepForward();
    }
  },

  pause: () => set({ status: 'paused' }),

  stepForward: () => {
    const { scenario, currentStepIndex } = get();
    if (!scenario) return;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= scenario.steps.length) {
      set({ status: 'finished' });
      return;
    }
    const step = scenario.steps[nextIndex];
    applyStep(step);
    const isLastStep = nextIndex === scenario.steps.length - 1;
    const currentStatus = get().status;
    set({
      currentStepIndex: nextIndex,
      status: isLastStep ? 'paused' : currentStatus === 'playing' ? 'playing' : 'stepping',
    });
  },

  stepBackward: () => {
    const { scenario, currentStepIndex } = get();
    if (!scenario || currentStepIndex <= 0) return;
    clearStates();
    const newIndex = currentStepIndex - 1;
    for (let i = 0; i <= newIndex; i++) {
      applyStep(scenario.steps[i]);
    }
    set({ currentStepIndex: newIndex, status: 'stepping' });
  },

  jumpToStep: (index) => {
    const { scenario } = get();
    if (!scenario || index < 0 || index >= scenario.steps.length) return;
    clearStates();
    for (let i = 0; i <= index; i++) {
      applyStep(scenario.steps[i]);
    }
    set({ currentStepIndex: index, status: 'stepping' });
  },

  reset: () => {
    clearStates();
    set({ currentStepIndex: -1, status: 'idle' });
  },

  setSpeed: (speed) => set({ speed }),
}));
