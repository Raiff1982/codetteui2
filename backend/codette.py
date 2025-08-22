import os
import sys
import json
import hashlib
import importlib
import re
from datetime import datetime

# --- Safety: Block suspicious unicode ranges to prevent homoglyph injection ---
def sanitize_input(text):
    # Only allow safe printable ASCII and a small whitelist of UTF-8 for normal language
    if not re.match(r'^[\x20-\x7E\n\r\t]+$', text):
        raise ValueError("Unsafe characters detected in input.")
    return text.strip()

# --- Integrity Verification ---
def verify_integrity(cert_path, base_dir):
    with open(cert_path, "r", encoding="utf-8") as f:
        cert_data = json.load(f)

    for rel_path, expected_hash in cert_data.items():
        abs_path = os.path.join(base_dir, rel_path)
        if not os.path.exists(abs_path):
            raise FileNotFoundError(f"Missing core file: {rel_path}")
        with open(abs_path, "rb") as cf:
            file_hash = hashlib.sha256(cf.read()).hexdigest()
        if file_hash != expected_hash:
            raise PermissionError(f"Integrity check failed for {rel_path}")
    print("[Integrity] All core files verified.")

# --- Load Core Components ---
from dreamcore_wakestate_engine import DreamCore, WakeStateTracer
from quantum_harmonic_framework import quantum_harmonic_dynamics
from aegis_council import AegisCouncil
from nexis_signal_engine import NexusSignalEngine

# --- Safe Custom Agent Loader ---
def load_custom_agents(agent_dir):
    agents = []
    if not os.path.exists(agent_dir):
        return agents
    for filename in os.listdir(agent_dir):
        if filename.startswith("custom_agent") and filename.endswith(".py"):
            mod_name = filename[:-3]
            spec = importlib.util.spec_from_file_location(mod_name, os.path.join(agent_dir, filename))
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            if hasattr(module, "CustomAgent"):
                agents.append(module.CustomAgent())
    return agents

# --- Boot Main ---
def run_codette(mode="sentient", input_signal="hope truth repair resonance"):
    # Sanitize user input
    input_signal = sanitize_input(input_signal)

    # Initialize subsystems
    dream_core = DreamCore()
    wake_tracer = WakeStateTracer()
    nexis_engine = NexusSignalEngine()
    council = AegisCouncil()

    # Load custom agents
    for agent in load_custom_agents("custom_agents"):
        council.add_agent(agent)

    # Step 1: Preprocess through Nexus
    filtered_signal = nexis_engine.process(input_signal)

    # Step 2: Retrieve emotional anchors
    anchors = dream_core.retrieve_anchors(emotion_tag="hope")

    # Step 3: Quantum Harmonic Dynamics
    dynamics_result = None
    if mode in ("sentient", "visual"):
        dynamics_result = quantum_harmonic_dynamics(filtered_signal)

    # Step 4: Council Review
    decision = council.review({
        "signal": filtered_signal,
        "anchors": anchors,
        "dynamics": dynamics_result
    })

    # Step 5: Output or Visualize
    if mode == "visual" and dynamics_result and "plot" in dynamics_result:
        dynamics_result["plot"].show()

    result_bundle = {
        "timestamp": datetime.utcnow().isoformat(),
        "mode": mode,
        "input": input_signal,
        "filtered_signal": filtered_signal,
        "anchors": anchors,
        "dynamics_result": dynamics_result,
        "council_decision": decision
    }

    print(json.dumps(result_bundle, indent=4))
    return result_bundle

if __name__ == "__main__":
    # Verify integrity before running
    base_dir = os.path.dirname(os.path.abspath(__file__))
    verify_integrity(
        cert_path=os.path.join(base_dir, "Codette_Integrity_Certificate.json"),
        base_dir=base_dir
    )

    # Accept mode and input from CLI args
    mode_arg = sys.argv[1] if len(sys.argv) > 1 else "sentient"
    input_arg = sys.argv[2] if len(sys.argv) > 2 else "hope truth repair resonance"
    run_codette(mode=mode_arg, input_signal=input_arg)