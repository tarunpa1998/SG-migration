'use client';

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  FileText, 
  LayoutGrid,
  User,
  Calendar,
  Tag
} from "lucide-react";
import RichTextEditor from "../RichTextEditor/RichTextEditor";

// Article interface based on the MongoDB model
interface Article {
  id: string;
  _id?: string;  // Support both formats
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  publishDate: string;
  author: string;
  authorTitle?: string;
  authorImage?: string;
  image?: string;
  category: string;
  tags: string[];
  featured: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  views: number;
}

// Initial empty article for creating new articles
const emptyArticle: Omit<Article, 'id' | '_id'> = {
  title: "",
  content: "",
  excerpt: "",
  slug: "",
  publishDate: new Date().toISOString(),
  author: "",
  authorTitle: "",
  authorImage: "",
  image: "",
  category: "",
  tags: [],
  featured: false,
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: []
  },
  views: 0
};

const ArticlesAdmin = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<Article, 'id' | '_id'>>(emptyArticle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Check if we're in the browser before accessing localStorage
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('adminToken');
      }
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Error fetching articles',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyArticle);
    setCurrentArticle(null);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleEdit = (article: Article) => {
    setIsEditing(true);
    setEditForm(article);
    setCurrentArticle(article);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      // Check if we're in the browser before accessing localStorage
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('adminToken');
      }
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      // Update the UI by removing the deleted article
      setArticles(articles.filter(item => 
        (item._id !== articleId && item.id !== articleId)
      ));
      
      toast({
        title: 'Article deleted',
        description: 'The article has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error deleting article',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Check if we're in the browser before accessing localStorage
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('adminToken');
      }
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // Make sure we have required fields
      if (!editForm.title || !editForm.content || !editForm.excerpt) {
        throw new Error('Title, content, and excerpt are required');
      }

      // Process array data - ensure tags and keywords are arrays
      const processedForm = {
        ...editForm,
        tags: Array.isArray(editForm.tags) 
          ? editForm.tags 
          : String(editForm.tags).split(',').map(item => item.trim()).filter(Boolean),
        seo: {
          ...editForm.seo,
          keywords: typeof editForm.seo.keywords === 'string' 
            ? String(editForm.seo.keywords).split(',').map(k => k.trim()).filter(Boolean) 
            : editForm.seo.keywords
        }
      };

      // Use the appropriate ID field (supporting both formats)
      const articleId = currentArticle?.id || currentArticle?._id;
      const url = isEditing
        ? `/api/admin/articles/${articleId}`
        : '/api/admin/articles';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(processedForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save article');
      }

      const savedArticle = await response.json();
      
      if (isEditing) {
        // Update existing article in the list
        setArticles(articles.map(item => {
          // Handle both ID formats by comparing with both
          const matchesId = item.id === savedArticle.id || item._id === savedArticle._id;
          return matchesId ? savedArticle : item;
        }));
      } else {
        // Add new article to the list
        setArticles([...articles, savedArticle]);
      }
      
      setDialogOpen(false);
      toast({
        title: isEditing ? 'Article updated' : 'Article created',
        description: isEditing 
          ? 'The article has been updated successfully' 
          : 'A new article has been created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error saving article',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const parentKey = parent as keyof typeof editForm;
      
      if (parentKey === 'seo') {
        setEditForm({
          ...editForm,
          seo: {
            ...editForm.seo,
            [child]: value
          }
        });
      } else {
        // Check if the parent property exists and is an object before spreading
        const parentValue = editForm[parentKey];
        if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
          // Use type assertion to tell TypeScript this is a Record<string, any>
          const safeParentValue = parentValue as Record<string, any>;
          setEditForm({
            ...editForm,
            [parent]: {
              ...safeParentValue,
              [child]: value
            }
          });
        } else {
          // If parent doesn't exist or isn't an object, create a new object
          setEditForm({
            ...editForm,
            [parent]: {
              [child]: value
            }
          });
        }
      }
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditForm({
      ...editForm,
      [name]: checked
    });
  };
  
  const handleRichTextChange = (content: string) => {
    setEditForm({
      ...editForm,
      content
    });
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.tags && article.tags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Articles</h2>
          <p className="text-slate-500 mt-2">
            Manage all your articles
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Article
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                          No articles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredArticles.map((article) => (
                        <TableRow key={article.id || article._id}>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>{article.author}</TableCell>
                          <TableCell>{article.category}</TableCell>
                          <TableCell>
                            {new Date(article.publishDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {article.featured ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                No
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(article)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(article.id || article._id || "")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No articles found
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <Card key={article.id || article._id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-ellipsis overflow-hidden whitespace-nowrap" title={article.title}>
                        {article.title}
                      </CardTitle>
                      <CardDescription className="flex justify-between">
                        <span>{article.author}</span>
                        <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {article.excerpt}
                      </p>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {article.tags.slice(0, 3).map((tag, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                              +{article.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div>
                        {article.featured && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(article)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(article.id || article._id || "")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Article Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Article" : "Create New Article"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the article"
                : "Add a new article to your collection"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    placeholder="Article title"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      name="category"
                      value={editForm.category}
                      onChange={handleInputChange}
                      placeholder="Article category"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input
                      id="publishDate"
                      name="publishDate"
                      type="date"
                      value={editForm.publishDate.split('T')[0]}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={editForm.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={editForm.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the article"
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={Array.isArray(editForm.tags) 
                      ? editForm.tags.join(', ') 
                      : editForm.tags
                    }
                    onChange={handleInputChange}
                    placeholder="study abroad, scholarships, etc."
                  />
                  <p className="text-xs text-slate-500">
                    Comma-separated list of tags
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      name="author"
                      value={editForm.author}
                      onChange={handleInputChange}
                      placeholder="Author name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorTitle">Author Title</Label>
                    <Input
                      id="authorTitle"
                      name="authorTitle"
                      value={editForm.authorTitle}
                      onChange={handleInputChange}
                      placeholder="e.g. Education Consultant"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorImage">Author Image URL</Label>
                  <Input
                    id="authorImage"
                    name="authorImage"
                    value={editForm.authorImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/author.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={editForm.featured}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('featured', checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Feature this article (will be displayed prominently)
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  content={editForm.content}
                  onChange={handleRichTextChange}
                  placeholder="Start writing your article content..."
                  className="min-h-[400px]"
                />
                <p className="text-xs text-slate-500">
                  Supports rich text formatting and markdown
                </p>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo.metaTitle">Meta Title</Label>
                <Input
                  id="seo.metaTitle"
                  name="seo.metaTitle"
                  value={editForm.seo.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO title (if different from article title)"
                />
                <p className="text-xs text-slate-500">
                  If left empty, the article title will be used
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.metaDescription">Meta Description</Label>
                <Textarea
                  id="seo.metaDescription"
                  name="seo.metaDescription"
                  value={editForm.seo.metaDescription}
                  onChange={handleInputChange}
                  placeholder="SEO description"
                  rows={3}
                />
                <p className="text-xs text-slate-500">
                  If left empty, the article excerpt will be used
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.keywords">Keywords</Label>
                <Input
                  id="seo.keywords"
                  name="seo.keywords"
                  value={Array.isArray(editForm.seo.keywords) 
                    ? editForm.seo.keywords.join(', ') 
                    : editForm.seo.keywords
                  }
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-slate-500">
                  Comma-separated list of keywords
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={editForm.slug}
                  onChange={handleInputChange}
                  placeholder="article-url-slug"
                  required
                />
                <p className="text-xs text-slate-500">
                  The slug will be used in the article URL (e.g., /articles/article-url-slug)
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update Article" : "Create Article"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArticlesAdmin;


