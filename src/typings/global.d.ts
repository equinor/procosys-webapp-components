import * as React from 'react';

// React 19 (@types/react v19) removed the global `JSX` namespace in favour of
// `React.JSX`. This shim restores the global namespace so existing
// `JSX.Element` annotations keep working without touching every file.
declare global {
    namespace JSX {
        type Element = React.JSX.Element;
        type ElementClass = React.JSX.ElementClass;
        type ElementAttributesProperty = React.JSX.ElementAttributesProperty;
        type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute;
        type LibraryManagedAttributes<C, P> =
            React.JSX.LibraryManagedAttributes<C, P>;
        type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
        type IntrinsicClassAttributes<T> =
            React.JSX.IntrinsicClassAttributes<T>;
        type IntrinsicElements = React.JSX.IntrinsicElements;
    }
}
