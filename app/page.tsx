'use client'

import { useState, useEffect } from 'react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [isClient, setIsClient] = useState(false)

  // 客户端 hydration
  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('todos')
    if (saved) {
      try {
        setTodos(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse todos')
      }
    }
  }, [])

  // 保存到 localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, isClient])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date(),
    }

    setTodos([newTodo, ...todos])
    setInputValue('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.filter(todo => todo.completed).length

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">加载中...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            ✨ 待办事项
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            简单高效，管理你的任务
          </p>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-6 animate-slide-up">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="添加新的待办事项..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 disabled:scale-100"
            >
              添加
            </button>
          </div>
        </form>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="flex justify-between items-center mb-4 text-sm text-slate-500 dark:text-slate-400 animate-fade-in">
            <span>共 {todos.length} 个任务</span>
            <div className="flex gap-4">
              <span>{activeCount} 待完成</span>
              <span>{completedCount} 已完成</span>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {todos.length > 0 && (
          <div className="flex gap-2 mb-4 animate-scale-in">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {f === 'all' ? '全部' : f === 'active' ? '待完成' : '已完成'}
              </button>
            ))}
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 animate-fade-in">
              {todos.length === 0 ? (
                <div>
                  <div className="text-4xl mb-2">📝</div>
                  <p>还没有待办事项</p>
                  <p className="text-sm">添加一个开始管理你的任务吧</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">🔍</div>
                  <p>没有找到匹配的任务</p>
                </div>
              )}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 animate-slide-up hover:shadow-md ${
                  todo.completed
                    ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    todo.completed
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-slate-300 dark:border-slate-500 hover:border-primary-500'
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 transition-all duration-200 ${
                    todo.completed
                      ? 'text-slate-400 dark:text-slate-500 line-through'
                      : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  删除
                </button>
              </div>
            ))
          )}
        </div>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="mt-4 text-sm text-slate-400 hover:text-red-500 transition-colors duration-200"
          >
            清除已完成的任务
          </button>
        )}
      </div>
    </main>
  )
}
