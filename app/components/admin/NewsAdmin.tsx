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
  LayoutGrid 
} from "lucide-react";
import RichTextEditor from "../RichTextEditor/RichTextEditor";

// News interface based on the MongoDB model
interface News {
  id: string;
  _id?: string;  // Support both formats
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string;
  author: string;
  authorTitle?: string;
  authorImage?: string;
  image?: string;
  category: string;
  isFeatured: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  views: number;
}

// Initial empty news for creating new news items
const emptyNews: Omit<News, 'id' | '_id'> = {
  title: "",
  content: "",
  summary: "",
  slug: "",
  publishDate: new Date().toISOString(),
  author: "",
  authorTitle: "",
  authorImage: "",
  image: "",
  category: "",
  isFeatured: false,
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: []
  },
  views: 0
};

const NewsAdmin = () => {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<News, 'id' | '_id'>>(emptyNews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      setNewsItems(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: 'Error fetching news',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyNews);
    setCurrentNews(null);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleEdit = (news: News) => {
    setIsEditing(true);
    setEditForm(news);
    setCurrentNews(news);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleDelete = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/news/${newsId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete news');
      }

      // Update the UI by removing the deleted news
      setNewsItems(newsItems.filter(item => 
        (item._id !== newsId && item.id !== newsId)
      ));
      
      toast({
        title: 'News deleted',
        description: 'The news item has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: 'Error deleting news',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Make sure we have required fields
      if (!editForm.title || !editForm.content || !editForm.summary) {
        throw new Error('Title, content, and summary are required');
      }

      // Convert keywords from string to array if it's a string
      const submissionData = {
        ...editForm,
        seo: {
          ...editForm.seo,
          keywords: typeof editForm.seo.keywords === 'string' 
            ? editForm.seo.keywords.split(',').map(k => k.trim()).filter(Boolean) 
            : editForm.seo.keywords
        }
      };

      // Use the appropriate ID field (supporting both formats)
      const newsId = currentNews?.id || currentNews?._id;
      const url = isEditing
        ? `/api/admin/news/${newsId}`
        : '/api/admin/news';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save news');
      }

      const savedNews = await response.json();
      
      if (isEditing) {
        // Update existing news in the list
        setNewsItems(newsItems.map(item => {
          // Handle both ID formats by comparing with both
          const matchesId = item.id === savedNews.id || item._id === savedNews._id;
          return matchesId ? savedNews : item;
        }));
      } else {
        // Add new news to the list
        setNewsItems([...newsItems, savedNews]);
      }
      
      setDialogOpen(false);
      toast({
        title: isEditing ? 'News updated' : 'News created',
        description: isEditing 
          ? 'The news has been updated successfully' 
          : 'A new news item has been created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: 'Error saving news',
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
        setEditForm({
          ...editForm,
          [parent]: {
            ...editForm[parentKey],
            [child]: value
          }
        });
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

  const filteredNews = newsItems.filter(news => 
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">News</h2>
          <p className="text-slate-500 mt-2">
            Manage all your news items
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create News Item
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search news..."
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
                    {filteredNews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                          No news items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNews.map((news) => (
                        <TableRow key={news.id || news._id}>
                          <TableCell className="font-medium">{news.title}</TableCell>
                          <TableCell>{news.author}</TableCell>
                          <TableCell>{news.category}</TableCell>
                          <TableCell>
                            {new Date(news.publishDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {news.isFeatured ? (
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
                                onClick={() => handleEdit(news)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(news.id || news._id || "")}
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
              {filteredNews.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No news items found
                </div>
              ) : (
                filteredNews.map((news) => (
                  <Card key={news.id || news._id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-ellipsis overflow-hidden whitespace-nowrap" title={news.title}>
                        {news.title}
                      </CardTitle>
                      <CardDescription className="flex justify-between">
                        <span>{news.author}</span>
                        <span>{new Date(news.publishDate).toLocaleDateString()}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {news.summary}
                      </p>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div>
                        {news.isFeatured && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(news)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(news.id || news._id || "")}
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

      {/* News Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit News" : "Create New News Item"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the news item"
                : "Add a new news item to your collection"}
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
                    placeholder="News title"
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
                      placeholder="News category"
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
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={editForm.summary}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the news"
                    required
                    rows={3}
                  />
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
                      placeholder="e.g. Senior Editor"
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
                    id="isFeatured"
                    checked={editForm.isFeatured}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('isFeatured', checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="isFeatured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Feature this news item (will be displayed prominently)
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
                  placeholder="Start writing your news content..."
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
                  placeholder="SEO title (if different from news title)"
                />
                <p className="text-xs text-slate-500">
                  If left empty, the news title will be used
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
                  If left empty, the news summary will be used
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
                  placeholder="news-url-slug"
                  required
                />
                <p className="text-xs text-slate-500">
                  The slug will be used in the news URL (e.g., /news/news-url-slug)
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
                isEditing ? "Update News" : "Create News"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsAdmin;