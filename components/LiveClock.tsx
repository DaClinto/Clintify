'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LiveClock() {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time with beautiful styling
    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        
        return {
            hours: displayHours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            period,
            dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
            dayNumber: date.getDate(),
            monthName: date.toLocaleDateString('en-US', { month: 'long' }),
            year: date.getFullYear()
        };
    };

    const timeData = formatTime(time);

    if (!mounted) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Loading...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-white/10 backdrop-blur-sm">
            {/* Time Display */}
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white tabular-nums">
                    {timeData.hours}
                </span>
                <span className="text-3xl font-bold text-white animate-pulse">
                    :
                </span>
                <span className="text-3xl font-bold text-white tabular-nums">
                    {timeData.minutes}
                </span>
                <span className="text-xl font-semibold text-white/80 animate-pulse">
                    :
                </span>
                <span className="text-xl font-semibold text-white/60 tabular-nums">
                    {timeData.seconds}
                </span>
                <span className="text-lg font-bold text-primary ml-2">
                    {timeData.period}
                </span>
            </div>

            {/* Date Display */}
            <div className="flex flex-col items-center gap-0.5">
                <div className="text-sm font-semibold text-white/90">
                    {timeData.dayName}
                </div>
                <div className="text-xs text-muted-foreground">
                    {timeData.monthName} {timeData.dayNumber}, {timeData.year}
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-primary/5 to-purple-500/5 pointer-events-none" />
        </div>
    );
}
