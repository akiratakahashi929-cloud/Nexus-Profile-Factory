import React, { useState, useMemo } from 'react';
import { calculateProfit, CARRIER_TEMPLATES, type MnpScenario } from './simulatorEngine';
import { TrendingUp, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [scenario, setScenario] = useState<MnpScenario>({
    id: '1',
    carrierKey: 'rakuten',
    lineCount: 1,
    deviceSellPrice: 50000,
    cashbackAmount: 10000,
    otherCosts: 0
  });

  const result = useMemo(() => calculateProfit(scenario), [scenario]);

  const COLORS = ['#00FFCC', '#009FE3', '#E6007E', '#FFBB28'];
  const chartData = [
    { name: '事務手数料', value: result.costBreakdown.adminFees },
    { name: '維持費', value: result.costBreakdown.maintenanceCosts },
    { name: '違約金', value: result.costBreakdown.penalties },
    { name: 'その他', value: result.costBreakdown.others },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-[#000B18] text-white p-6 sm:p-10 font-sans">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#009FE3] to-[#002D56] rounded-xl flex items-center justify-center font-black shadow-lg">U</div>
          <h1 className="text-xl font-black uppercase tracking-tighter">スマホ物販 <span className="text-[#009FE3]">Ultimate</span> Simulator</h1>
        </motion.div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-[#00FFCC]">
          v1.0.0 Alpha
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card space-y-8"
        >
          <section>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">キャリア選択</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {Object.entries(CARRIER_TEMPLATES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setScenario({ ...scenario, carrierKey: key })}
                  className={`p-3 rounded-xl border text-[10px] font-black transition-all ${scenario.carrierKey === key
                    ? 'border-[#009FE3] bg-[#009FE3]/20 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">同時契約回線数</label>
              <span className="text-xl font-black text-[#009FE3]">{scenario.lineCount} <span className="text-[10px]">Lines</span></span>
            </div>
            <input
              type="range" min="1" max="5" step="1"
              value={scenario.lineCount}
              onChange={(e) => setScenario({ ...scenario, lineCount: parseInt(e.target.value) })}
              className="w-full accent-[#009FE3]"
            />
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">売却予想額 (1台)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00FFCC]" />
                <input
                  type="number"
                  value={scenario.deviceSellPrice}
                  onChange={(e) => setScenario({ ...scenario, deviceSellPrice: parseInt(e.target.value) || 0 })}
                  className="w-full input-glow pl-12 font-black text-lg"
                />
              </div>
            </section>
            <section>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">CB (1回線)</label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00FFCC]" />
                <input
                  type="number"
                  value={scenario.cashbackAmount}
                  onChange={(e) => setScenario({ ...scenario, cashbackAmount: parseInt(e.target.value) || 0 })}
                  className="w-full input-glow pl-12 font-black text-lg"
                />
              </div>
            </section>
          </div>
        </motion.div>

        {/* Result Section */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card bg-gradient-to-br from-[#009FE3]/20 via-[#000B18] to-[#E6007E]/10 border-[#009FE3]/30"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <label className="text-[10px] font-black text-[#00FFCC] uppercase tracking-widest mb-1 block">推定純利益 (Total Net Profit)</label>
                <div className="text-5xl font-black tracking-tighter">¥{result.netProfit.toLocaleString()}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E2FF00]">
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <div className="text-[9px] font-black text-white/40 uppercase mb-1">収益計</div>
                <div className="text-lg font-bold">¥{result.totalRevenue.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-white/40 uppercase mb-1">経費計</div>
                <div className="text-lg font-bold text-slate-300">¥{result.totalCost.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card h-64 flex flex-col items-center justify-center"
            >
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">経費内訳</label>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#002D56', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                      itemStyle={{ color: 'white' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-[#FFBB28]" size={20} />
                <h3 className="font-black text-sm uppercase tracking-tighter">稼働アドバイス</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 p-3 rounded-xl border-l-4 border-[#009FE3]">
                  <p className="text-[11px] font-bold text-slate-300">
                    {result.netProfit > 100000 ? "超優良案件です。複数回線の同時検討を推奨します。" : "平均的な利益率です。CBアップキャンペーンを待つのも手です。"}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border-l-4 border-[#FFBB28]">
                  <p className="text-[11px] font-bold text-slate-300">
                    最低維持期間（{CARRIER_TEMPLATES[scenario.carrierKey]?.minMaintenanceMonths}ヶ月）を遵守し、BL入りを回避してください。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 text-center">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">
          Ultimate Simulator | Powered by Career Craft Architecture
        </div>
      </footer>
    </div>
  );
};

export default App;
