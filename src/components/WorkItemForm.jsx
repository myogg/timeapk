import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const WorkItemForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    timePerUnit: '',
    isHourlyBased: false, // 新增字段：是否按小时计算
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        quantity: initialData.quantity.toString(),
        timePerUnit: initialData.isHourlyBased ? (initialData.timePerUnit / 60).toFixed(2) : initialData.timePerUnit.toString(),
        isHourlyBased: initialData.isHourlyBased || false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.timePerUnit) return;

    // 如果是按小时计算的配件，数量默认为1，工时转换为分钟
    const quantity = formData.isHourlyBased ? 1 : parseInt(formData.quantity || 1);
    const timePerUnit = formData.isHourlyBased ? parseFloat(formData.timePerUnit) * 60 : parseInt(formData.timePerUnit);

    const submitData = {
      ...initialData,
      name: formData.name,
      quantity: quantity,
      timePerUnit: timePerUnit,
      totalTime: formData.isHourlyBased ? timePerUnit : quantity * timePerUnit,
      isHourlyBased: formData.isHourlyBased,
    };

    onSubmit(submitData);
    if (!initialData) {
      setFormData({ name: '', quantity: '', timePerUnit: '', isHourlyBased: false });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            工件名称
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="请输入工件名称"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        {/* 添加按小时计算选项 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isHourlyBased"
            checked={formData.isHourlyBased}
            onChange={(e) => handleChange('isHourlyBased', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isHourlyBased" className="ml-2 block text-sm text-gray-700">
            按小时计算的配件（单件）
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              数量
            </label>
            <input
              type="number"
              value={formData.isHourlyBased ? 1 : formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="数量"
              min="1"
              disabled={formData.isHourlyBased}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                formData.isHourlyBased ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              required={!formData.isHourlyBased}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.isHourlyBased ? '工时(小时)' : '单件工时(分钟)'}
            </label>
            <input
              type={formData.isHourlyBased ? 'number' : 'number'}
              value={formData.timePerUnit}
              onChange={(e) => handleChange('timePerUnit', e.target.value)}
              placeholder={formData.isHourlyBased ? '小时' : '分钟'}
              min="0"
              step={formData.isHourlyBased ? '0.01' : '1'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        {formData.timePerUnit && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-700">
              预计总工时: {formData.isHourlyBased ? (parseFloat(formData.timePerUnit) * 60) : (parseInt(formData.quantity || 1) * parseInt(formData.timePerUnit))} 分钟
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Check className="h-4 w-4" />
            <span>{initialData ? '更新' : '确认'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <X className="h-4 w-4" />
            <span>取消</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkItemForm;
