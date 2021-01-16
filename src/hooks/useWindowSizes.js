import { useEffect, useCallback } from 'react';
import useForceUpdate from './useForceUpdate';
import { throttle } from 'throttle-debounce';

const DEFAULT_THROTTLE_DELAY = 1000;

const useWindowSizes = (throttleDelay = DEFAULT_THROTTLE_DELAY) => {
    const forceUpdate = useForceUpdate();

    const listener = useCallback(throttle(throttleDelay, (e) => {
        forceUpdate();
    }), [forceUpdate]);

    useEffect(() => {
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [listener]);

    return { innerHeight: window.innerHeight, innerWidth: window.innerWidth };
};

export default useWindowSizes;

