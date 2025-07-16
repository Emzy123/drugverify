
import React, { useState, useEffect } from 'react';
import { getEducationalContent } from '../services/geminiService';
import { EducationalArticle } from '../types';
import { BookOpenIcon } from './icons/UIIcons';

const ArticleCard: React.FC<{ article: EducationalArticle }> = ({ article }) => (
  <div className="bg-slate-50 rounded-xl p-6 hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-200 transition-all duration-300 group">
    <h4 className="text-lg font-bold text-cust-blue group-hover:text-blue-800">{article.title}</h4>
    <p className="mt-2 text-sm text-slate-600">{article.summary}</p>
    <span className="mt-4 inline-block text-sm font-semibold text-cust-green opacity-70 cursor-default">Read More &rarr;</span>
  </div>
);

const SkeletonCard: React.FC = () => (
    <div className="bg-slate-100 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
    </div>
);

export const EducationalResources: React.FC = () => {
  const [articles, setArticles] = useState<EducationalArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const content = await getEducationalContent();
      setArticles(content);
      setLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <section className="mt-16 py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3">
              <BookOpenIcon className="w-8 h-8 text-cust-brown" />
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Knowledge Center</h2>
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Stay informed and protect your health with these essential resources on medication safety.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            articles.map((article, index) => (
              <ArticleCard key={index} article={article} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
