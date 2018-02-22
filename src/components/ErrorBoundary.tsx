import * as React from 'react';
import { toast } from 'react-toastify';

export default class ErrorBoundary extends React.Component {

  componentDidCatch(err: any, info: any) {
    toast.error(
      <div>
        <strong>{err.message}</strong>
        <div>{info}</div>
      </div>
    );
  }

  render() {
    return this.props.children;
  }
}