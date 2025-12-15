const Log = require('../models/Log');

/**
 * 创建日志记录的辅助函数
 * @param {Object} options - 日志选项
 * @param {String} options.userId - 用户ID (可选，匿名用户可为null)
 * @param {String} options.action - 动作类型，如 'VIEW_PRODUCT', 'PLACE_ORDER', 'LOGIN' 等
 * @param {String} options.targetId - 关联的目标ID，如商品ID或订单ID (可选)
 * @param {Object} options.details - 其他详细信息 (可选)
 */
const createLog = async (options) => {
    try {
        const log = new Log({
            user: options.userId || null,
            action: options.action,
            targetId: options.targetId || null,
            details: options.details || {},
        });

        await log.save();
        console.log(`📝 日志记录成功: ${options.action}`);
        return log;
    } catch (error) {
        console.error('❌ 日志记录失败:', error.message);
        // 日志失败不应该影响主业务流程，所以只记录错误
    }
};

module.exports = { createLog };
