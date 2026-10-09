import { Component } from "react";
export default class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="scene-fallback">The 3D view is unavailable. You can still explore all of Rohit's work.</div> : this.props.children; }
}
