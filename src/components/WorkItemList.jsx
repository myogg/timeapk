import React from 'react';
import { Trash2, Edit } from 'lucide-react';

const WorkItemList = ({ items, onRemove, onEdit }) => {
  const totalTime = items.reduce((sum, item) => sum + item.totalTime, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-3 mb-4">
      <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-100 p-2 rounded-lg">
        <span>共 {items.length} 种工件</span>
        <span>总计 {totalQuantity} 件</span>
        <span>预计 {Math.round(totalTime / 60 * 100) / 100} 小时</span>
      </div>

      {items.map((item) => (
        <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200 hover:bg-gray-100 transition-colors">
          <div className="flex-1">
            <div className="font-medium text-gray-800 flex items-center">
              {item.name}
              {item.isHourlyBased && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  按小时
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {item.isHourlyBased 
                ? `工时: ${Math.round(item.timePerUnit / 60 * 100) / 100} 小时` 
                : `数量: ${item.quantity} 件 × ${item.timePerUnit} 分钟 = ${item.totalTime} 分钟`
              }
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(item)}
              className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-100 rounded-lg transition-colors"
              title="编辑"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkItemList;
