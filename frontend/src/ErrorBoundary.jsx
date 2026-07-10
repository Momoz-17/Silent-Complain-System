import React from 'react';

// Without this, any unexpected runtime error (bad API response shape,
// null reference, etc.) crashes the entire React tree to a blank white
// screen in production with no way for the user to recover.
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Unhandled UI error:', error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
                    <div className="max-w-sm w-full text-center bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h1 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h1>
                        <p className="text-sm text-gray-500 mb-6">
                            An unexpected error occurred. Please try reloading the page.
                        </p>
                        <button
                            onClick={this.handleReload}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;