# ============================================================
# AI导航站 - Skills自动化 Docker容器
# ============================================================
# 功能：始终在线的Skills自动更新服务
#
# 部署方式：
#   1. 构建: docker build -t skills-auto .
#   2. 运行: docker run -d --name skills-auto --restart always \
#            -e DEEPSEEK_API_KEY=your_api_key \
#            -e DEEPSEEK_BASE_URL=https://api.deepseek.com \
#            skills-auto
#   3. 查看日志: docker logs -f skills-auto
#
# 定时任务：
#   容器内已配置crontab，每天凌晨2点执行
# ============================================================

FROM python:3.11-slim

# 防止Python输出缓冲
ENV PYTHONUNBUFFERED=1

# 设置工作目录
WORKDIR /app

# 复制脚本
COPY scripts/skills-auto.py .
COPY scripts/skills-auto.sh .
COPY data/ ./data/

# 安装定时任务
RUN apt-get update && apt-get install -y \
    cron \
    && rm -rf /var/lib/apt/lists/*

# 配置时区
ENV TZ=Asia/Shanghai
ENV MODE=update

# 配置定时任务（每天凌晨2点执行）
RUN echo "0 2 * * * cd /app && python skills-auto.py --mode update >> /var/log/skills-auto.log 2>&1" >> /var/spool/cron/crontabs/root

# 创建日志文件
RUN touch /var/log/skills-auto.log

# 暴露端口（可选，用于健康检查）
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=6h --timeout=10s --start-period=10s \
    CMD python -c "print('OK')" || exit 1

# 启动命令
CMD cron && tail -f /var/log/skills-auto.log

# ============================================================
# 使用说明
# ============================================================
# 
# 1. 构建镜像
#    docker build -t skills-auto -f Dockerfile ..
#
# 2. 运行容器（通过环境变量传入敏感信息）
#    docker run -d \
#      --name skills-auto \
#      --restart always \
#      -e DEEPSEEK_API_KEY=your_actual_api_key \
#      -e DEEPSEEK_BASE_URL=https://api.deepseek.com \
#      -e SITE_URL=https://longxiaclub.com \
#      -v ./logs:/var/log \
#      skills-auto
#
# 3. 使用 docker-compose（推荐）
#    docker-compose up -d
#
# 4. 手动执行
#    docker exec skills-auto python skills-auto.py --mode generate
#
# 5. 查看日志
#    docker logs -f skills-auto
#
# 6. 进入容器
#    docker exec -it skills-auto /bin/bash
#
# ============================================================
