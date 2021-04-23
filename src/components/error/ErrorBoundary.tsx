import React, { ErrorInfo } from 'react';
import ErrorPage from './ErrorPage';

type ErrorProps = {
    children: React.ReactChild;
};

type ErrorState = {
    name?: string;
    message?: string;
    hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
    constructor(props: ErrorProps) {
        super(props);
        this.state = { hasError: false, message: '', name: '' };
    }

    static getDerivedStateFromError(): ErrorState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({
            ...this.state,
            message: error.message,
            name: error.name,
        });
        // console.error('CRITICAL ERROR OCCURED');
        // console.error('Error: ', error);
        // console.error('ErrorInfo: ', errorInfo);
    }

    render(): React.ReactChild {
        if (this.state.hasError) {
            return (
                <ErrorPage
                    title={this.state.name ?? ''}
                    description={this.state.message ?? ''}
                />
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
