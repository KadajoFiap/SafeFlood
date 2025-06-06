'use client';

import Dashboard from '../components/Dashboard/Dashboard';

export default function Riscos() {
    return (
        <div className="min-h-screen bg-[#132536] pt-10 px-2 md:px-10 lg:pl-20 lg:pr-20 md:pl-15 md:pr-15 pb-20 md:pb-0">
            <div className="flex flex-col items-left justify-center">
                <h1 className="text-2xl md:text-3xl font-semibold text-center md:text-left text-[#F5FAFF] pb-8">Dashboard de riscos</h1>
                <div className="w-full flex items-center justify-center">
                    <Dashboard />
                </div>
            </div>
        </div>
    )
}
