import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Edit, ArrowLeft, Calendar, Clock, ChevronRight, Package, ChevronLeft, Download, Upload } from 'lucide-react';
import { endOfMonth, addMonths, isSameMonth, format, startOfMonth, subMonths, isAfter, isBefore } from 'date-fns';
import Navigation from '../components/Navigation.jsx';
import { getMonthlyReport, importData } from '../utils/storage.js';
import { exportToPDF, exportToCSV, exportToJSON } from '../utils/exportUtils.js';

const MonthlyReport = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workDays, setWorkDays] = useState(0);
  const [isEditingDays, setIsEditingDays] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: report, isLoading } = useQuery({
    queryKey: ['monthlyReport', format(currentDate, 'yyyy-MM')],
    queryFn: () => getMonthlyReport(currentDate),
  });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const nextMonth = addMonths(currentDate, 1);
    const nextMonthStart = startOfMonth(nextMonth);

    if (isBefore(nextMonthStart, currentMonthStart) || isSameMonth(nextMonthStart, currentMonthStart)) {
      setCurrentDate(nextMonth);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        let data;
        let format;

        if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
          format = 'json';
        } else if (file.name.endsWith('.csv')) {
          alert('CSV导入暂不支持');
          return;
        } else {
          alert('不支持的文件格式');
          return;
        }

        const count = await importData(data, format);
        if (count > 0) {
          alert(`成功导入 ${count} 条记录`);
          queryClient.invalidateQueries({ queryKey: ['monthlyReport'] });
          queryClient.invalidateQueries({ queryKey: ['allRecords'] });
        } else {
          alert('没有新记录需要导入');
        }
      } catch (error) {
        console.error('导入失败:', error);
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSaveWorkDays = () => {
    // 保存工作日数到localStorage
    const monthKey = format(currentDate, 'yyyy-MM');
    localStorage.setItem(`workDays_${monthKey}`, workDays.toString());
    setIsEditingDays(false);
  };

  const handleEditWorkDays = () => {
    // 加载已保存的工作日数
    const monthKey = format(currentDate, 'yyyy-MM');
    const savedDays = localStorage.getItem(`workDays_${monthKey}`);
    if (savedDays) {
      setWorkDays(parseInt(savedDays));
    } else {
      setWorkDays(0);
    }
    setIsEditingDays(true);
  };

  const handleExportPDF = async () => {
    const success = await exportToPDF('monthly-report-content', `月统计_${format(currentDate, 'yyyy-MM')}.pdf`);
    if (success) {
      alert('PDF导出成功');
    } else {
      alert('PDF导出失败');
    }
  };

  const handleExportCSV = () => {
    if (!report) return;

    const csvData = Object.values(report.itemStats).map(item => ({
      月份: format(currentDate, 'yyyy-MM'),
      工件名称: item.name,
      单位工时: item.timePerUnit,
      总数量: item.totalQuantity,
      总工时: Math.round(item.totalTime / 60 * 100) / 100,
      工作天数: item.workDays
    }));

    const success = exportToCSV(csvData, `月统计_${format(currentDate, 'yyyy-MM')}.csv`);
    if (success) {
      alert('CSV导出成功');
    } else {
      alert('CSV导出失败');
    }
  };

  const handleExportJSON = () => {
    if (!report) return;

    const monthKey = format(currentDate, 'yyyy-MM');
    const savedWorkDays = localStorage.getItem(`workDays_${monthKey}`);
    const displayWorkDays = savedWorkDays ? parseInt(savedWorkDays) : 0;
    const totalMinutes = Object.values(report.itemStats).reduce((sum, stat) => sum + stat.totalTime, 0);
    const totalHours = Math.round(totalMinutes / 60 * 100) / 100;
    const standardHours = displayWorkDays * 8;
    const overtimeHours = totalHours > standardHours ? totalHours - standardHours : 0;

    const jsonData = {
      month: format(currentDate, 'yyyy-MM'),
      workDays: displayWorkDays,
      standardHours: standardHours,
      actualHours: totalHours,
      overtimeHours: overtimeHours,
      itemStats: report.itemStats,
      totalWorkDays: report.totalWorkDays,
      records: report.records
    };

    const success = exportToJSON(jsonData, `月统计_${format(currentDate, 'yyyy-MM')}.json`);
    if (success) {
      alert('JSON导出成功');
    } else {
      alert('JSON导出失败');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  const totalMinutes = report ? Object.values(report.itemStats).reduce((sum, stat) => sum + stat.totalTime, 0) : 0;
  const totalHours = Math.round(totalMinutes / 60 * 100) / 100;

  const monthKey = format(currentDate, 'yyyy-MM');
  const savedWorkDays = localStorage.getItem(`workDays_${monthKey}`);
  const displayWorkDays = savedWorkDays ? parseInt(savedWorkDays) : 0;

  const standardHours = displayWorkDays * 8;
  const overtimeHours = totalHours > standardHours ? totalHours - standardHours : 0;

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const targetMonthStart = startOfMonth(currentDate);
  const isFutureMonth = isAfter(targetMonthStart, currentMonthStart);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      <div className="max-w-md mx-auto p-4 pt-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {format(currentDate, 'yyyy年MM月')}
              </h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextMonth}
                disabled={isFutureMonth}
                className={`p-2 rounded-lg transition-colors ${
                  isFutureMonth 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {isFutureMonth && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-center">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-800 font-medium">未来月份</p>
              <p className="text-sm text-blue-600 mt-1">只能查看已过去的月份记录</p>
            </div>
          )}

          {!isFutureMonth && (
            <>

              <div id="monthly-report-content">
                {/* 工作日设置 */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">每月工作日设置</h3>
                      <p className="text-sm text-gray-600">设置本月实际工作天数</p>
                    </div>
                    <button
                      onClick={handleEditWorkDays}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                      title="编辑工作日"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {isEditingDays ? (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          value={workDays}
                          onChange={(e) => setWorkDays(parseInt(e.target.value) || 0)}
                          min="0"
                          max="31"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-gray-700">天</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveWorkDays}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setIsEditingDays(false)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{displayWorkDays}</div>
                      <div className="text-sm text-gray-600">工作日</div>
                    </div>
                  )}
                </div>

                {/* 工时统计卡片 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-center text-white shadow-md">
                    <Clock className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{totalHours}</div>
                    <div className="text-sm opacity-90">实际工时(小时)</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-center text-white shadow-md">
                    <Package className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {report ? Object.keys(report.itemStats).length : 0}
                    </div>
                    <div className="text-sm opacity-90">工件种类</div>
                  </div>
                </div>

                {/* 标准工时和加班工时显示 */}
                {displayWorkDays > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-center text-white shadow-md">
                      <Calendar className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{standardHours}</div>
                      <div className="text-sm opacity-90">标准工时(小时)</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-center text-white shadow-md">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{overtimeHours.toFixed(2)}</div>
                      <div className="text-sm opacity-90">加班工时(小时)</div>
                    </div>
                  </div>
                )}

                {report && Object.keys(report.itemStats).length > 0 ? (
                  <div className="mt-6 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>配件种类列表</span>
                    </h3>
                    <div className="space-y-3">
                      {Object.values(report.itemStats)
                        .sort((a, b) => b.totalTime - a.totalTime)
                        .map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:bg-gray-100 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-800">{item.name}</div>
                            <div className="text-sm text-blue-600 font-semibold">
                              {Math.round(item.totalTime / 60 * 100) / 100} 小时
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            单位工时: {item.timePerUnit} 分钟/件 |
                            总数量: {item.totalQuantity} 件
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            工作天数: {item.workDays} 天
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500">本月暂无工作记录</div>
                  </div>
                )}
              </div>

              {/* 导出和导入按钮 */}
              <div className="mt-6 space-y-3">
                <div className="text-sm font-medium text-gray-700 mb-2">导出</div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center justify-center space-x-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center justify-center space-x-2 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {/* 导入按钮 */}
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">导入</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>导入数据 (JSON)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default MonthlyReport;
