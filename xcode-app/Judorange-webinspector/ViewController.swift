//
//  ViewController.swift
//  web_dev_browser-v0
//
//  Created by Julien Cuénot on 07/05/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import UIKit
import WebKit


// ==========================================================================

protocol NavBarDelegate {
    //func testDelegate()
    func loadUrlField()
}

protocol TabBarCustomDelegate {
    func newTab()
    func removeTab(index:Int)
    func selectTab(index:Int)
    func tabUpdateUrlField(index:Int)
}

protocol WebViewsManagerDelegate {
    //func testDelegate()
    func updateBackForwardBtnStates(index: Int)
    func updateUrlField(index: Int)
    func updateTabName(index: Int)
}

protocol ToolBarDelegate {
    //func testDelegate()
    func goBack()
    func goForward()
    func goHome()
    func goReload()
    func showOrHideInspector()
}

// ==========================================================================





class ViewController:UIViewController, WKUIDelegate, WKNavigationDelegate, NavBarDelegate, WebViewsManagerDelegate, ToolBarDelegate, TabBarCustomDelegate {

    
    
    
    
    // ==========================================================================
    // DEAL WITH CHILD VIEW CONTROLLERS
    
    // CHILD CONTAINER VIEW IS HERE
    var navBarController: NavBarController?
    var tabBarCustom: TabBarCustom?
    var webViewsManagerController: WebViewsManagerController?
    var toolBarController: ToolBarController?
    
    // ACCESS CONTAINER VIEW CHILD
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
        
        if(segue.identifier == "navbarSegue"){
            navBarController = segue.destination as? NavBarController
            navBarController?.navBarDelegate = self
        }
        
        if(segue.identifier == "tabbarcustomSegue"){
            tabBarCustom = segue.destination as? TabBarCustom
            tabBarCustom?.tabBarCustomDelegate = self
        }
        
        if(segue.identifier == "webviewManagerSegue"){
            webViewsManagerController = segue.destination as? WebViewsManagerController
            webViewsManagerController?.webViewsManagerDelegate = self as WebViewsManagerDelegate
        }
        
        if(segue.identifier == "toolbarSegue"){
            toolBarController = segue.destination as? ToolBarController
            toolBarController?.toolBarDelegate = self as ToolBarDelegate
        }
        
    }
    
    // RETRIEVE DATA. THANKS TO PROTOCOL AT THE TOP OF THE DOCUMENT
    //func testDelegate(){ print("PARENT") }
    
    // ==========================================================================
    
    
    
    
    
    
    // NAV BAR ==========================================================
    
    func loadUrlField(){
        // LOAD REMOTE URL
        let str_url = navBarController?.urlField.text ?? "https://judorange.ju-dev.fr"
        webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].loadURL(str_url: str_url)
        webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].loadJSFiles()
    }
    
    // ==========================================================================
    
    
    
    
    
    
    // TAB BAR ==========================================================
    
    func newTab(){
        //print("new tab")
        webViewsManagerController!.addWebView()
        let new_webview_id = webViewsManagerController!.webViewControllers.count - 1
        webViewsManagerController!.setCurrentWebView(index: new_webview_id)
    }
    
    func selectTab(index:Int){
        webViewsManagerController!.setCurrentWebView(index: index)
    }
    
    func removeTab(index:Int){
        webViewsManagerController!.removeWebView(index: index)
    }
    
    func tabUpdateUrlField(index:Int){
        var webview = WKWebView()
        
        if index < webViewsManagerController!.webViewControllers.count {
            webview = webViewsManagerController!.webViewControllers[index].webView
        }
        else{ // WHEN ADD TAB WEB VIEW IS NOT LOADED
            webview = webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView
        }
        
        let str_webview_url = webview.url?.absoluteString ?? "error"
        print(str_webview_url)
        navBarController!.urlField.text = str_webview_url
    }
    
    // ==========================================================================
    
    
    
    
    
    
    // WEBVIEW ==========================================================
    
    func updateBackForwardBtnStates(index: Int) { // Received call from webview
        // WEBVIEW
        let webview = webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView
        // UPDATE BACK
        if (webview.canGoBack){
            toolBarController!.backButton.isEnabled = true
        }
        else{
            toolBarController!.backButton.isEnabled = false
        }
        // UPDATE FORWARD
        if (webview.canGoForward){
            toolBarController!.forwardButton.isEnabled = true
        }
        else{
            toolBarController!.forwardButton.isEnabled = false
        }
        
    }
    
    func updateUrlField(index: Int) {
        print("index " + String(index) )
        let webview = webViewsManagerController!.webViewControllers[index].webView
        let str_webview_url = webview.url?.absoluteString ?? "error"
        print(str_webview_url)
        navBarController!.urlField.text = str_webview_url
    }
    
    func updateTabName(index: Int) {
        //
        var title = webViewsManagerController!.webViewControllers[index].webView.title
        if(title?.count ?? 0 < 1){ title = "New tab" }
        //
        tabBarCustom?.allButtons[index].setTitle(title, for: .normal)
        //
    }
    
    // ==========================================================================
    
    
    
    
    
    // TOOLBAR ==========================================================
    
    func goBack() {
        if (self.webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.canGoBack){ self.webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.goBack()
        }
    }
    
    func goForward() {
        if (self.webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.canGoForward){
            self.webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.goForward()
        }
    }
    
    func goHome() {
        self.webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].loadLocalWebsite()
    }
    
    func goReload() { webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.evaluateJavaScript("location.reload(true);", completionHandler: nil)
    }
    
    func showOrHideInspector(){ // SHOW OR HIDE INSPECTOR
        if(
            webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].isInspectorVisible
            ){
            webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.evaluateJavaScript("eruda.hide();", completionHandler: nil)
            webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].isInspectorVisible = false
        }
        else{ webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.evaluateJavaScript("eruda.show();", completionHandler: nil)
            webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].isInspectorVisible = true
        }
    }
    
    // ==========================================================================
    
    
    
    
    
    override func viewDidLoad() {   // loadView or viewDidLoad
        
        // CALL SUPER
        super.viewDidLoad()         // super.loadView or super.viewDidLoad
        
        // Disable navigation buttons on first loads
        toolBarController!.backButton.isEnabled = false
        toolBarController!.forwardButton.isEnabled = false
        
    }
    
    
    
    // AUTO HIDE HOME BOTTOM BAR
    override var prefersHomeIndicatorAutoHidden: Bool {
        return true
    }
    
    
    
    // STATUS BAR WHITE TEXT
    //override var preferredStatusBarStyle: UIStatusBarStyle {
    //    return .lightContent
    //}
    
    
    
} // End of class





