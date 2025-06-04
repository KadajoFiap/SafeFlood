'use client';

import Dashboard from '../components/Dashboard/Dashboard';

export default function Riscos() {
    return (
        <>
            <div className="h-screen bg-[#132536]">
                <h1 className="text-2xl font-semibold text-left text-[#F5FAFF] pt-8 pb-10 pl-10 text-[30px] ">Dashboard de riscos</h1>
                <div className="w-full flex items-center justify-center">
                    <Dashboard />
                </div>
            </div>
        </>
    )
}
